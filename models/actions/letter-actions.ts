'use server';

import { Resource } from 'sst';
import { Repository } from '@/services/repository';
import { getUserIdBySession } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import {
    LetterEntity,
    LetterInput,
    LetterPublic,
    PaymentStatus,
    ShippingStatus,
    createLetterEntityFromInput,
    toLetterPublic,
    LetterKeys,
} from '@/models/types/letter';
import { ActionResponse, withActionResponse } from '../types/response';
import { ReceivedLetterEntity } from '../types/received-letter';
import { UserKeys } from '../types/user';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';
import { getCurrentISOTime } from '@/lib/date';

// Repository 인스턴스 생성
const repository = new Repository(Resource.FromYouTable.name);

/**
 * 편지 임시저장 또는 업데이트
 */
export async function saveDraftAction(
    letterInput: LetterInput,
): Promise<ActionResponse<LetterPublic>> {
    return withActionResponse(async () => {
        console.log('letterInput', letterInput);
        const userId = await getUserIdBySession();
        const now = getCurrentISOTime();

        // letterInput.id가 있으면 업데이트, 없으면 새로 생성
        const letterId = letterInput.id || uuidv4();

        const letterEntity = createLetterEntityFromInput(letterInput, userId, letterId, now);

        // 새 편지인 경우 createdAt 추가
        if (!letterInput.id) {
            letterEntity.createdAt = now;
        }

        const { PK: _PK, SK: _SK, ...letterEntityWithoutKeys } = letterEntity; // 업데이트 시에는 키 제거

        const updatedLetter = await repository.update<LetterEntity>(
            UserKeys.pk(userId),
            LetterKeys.sk(letterId),
            letterEntityWithoutKeys,
        );

        return toLetterPublic(updatedLetter);
    });
}

/**
 * 특정 편지 조회 (자신의 편지만 조회)
 */
export async function getLetterAction(letterId: string): Promise<ActionResponse<LetterEntity>> {
    return withActionResponse(async () => {
        const userId = await getUserIdBySession();
        const letter = await repository.get<LetterEntity>(
            UserKeys.pk(userId),
            LetterKeys.sk(letterId),
        );

        if (!letter) {
            throw new Error('편지를 찾을 수 없습니다.');
        }

        if (!letter.isDraft) {
            throw new Error('이미 결제된 편지입니다.');
        }

        return letter;
    });
}

/**
 * 내 편지 목록 조회
 */
export async function getMyLettersAction(): Promise<
    ActionResponse<{
        letters: LetterEntity[];
        receivedLetters: ReceivedLetterEntity[];
    }>
> {
    return withActionResponse(async () => {
        const userId = await getUserIdBySession();

        // 편지 목록 조회
        const letters = await repository.query<LetterEntity>(
            LetterKeys.pk(userId),
            'LETTER#',
            true,
        );

        // 받은 편지 목록 조회
        const receivedLetters = await repository.query<ReceivedLetterEntity>(
            LetterKeys.pk(userId),
            'RECEIVED_LETTER#',
            true,
        );

        return {
            letters,
            receivedLetters,
        };
    });
}

/**
 * ID로 편지 조회
 */
export async function getLetterByIdAction(letterId: string): Promise<ActionResponse<LetterEntity>> {
    return withActionResponse(async () => {
        const userId = await getUserIdBySession();
        const letter = await repository.get<LetterEntity>(
            UserKeys.pk(userId),
            LetterKeys.sk(letterId),
        );

        if (!letter) {
            throw new Error('편지를 찾을 수 없습니다.');
        }

        return letter;
    });
}

/**
 * 사용자의 모든 편지 조회
 */
export async function getUserLettersAction(
    userId: string,
): Promise<ActionResponse<LetterPublic[]>> {
    return withActionResponse(async () => {
        const letters = await repository.query<LetterEntity>(UserKeys.pk(userId), 'LETTER#');
        return letters.map(toLetterPublic);
    });
}

/**
 * 모든 편지 조회 (관리자용)
 */
export async function getAllLettersAction(): Promise<ActionResponse<LetterPublic[]>> {
    return withActionResponse(async () => {
        const letters = await repository.queryGSI1<LetterEntity>('LETTER');
        return letters.map(toLetterPublic);
    });
}

/**
 * 임시저장을 제외한 편지 조회
 */
export async function getCompleteLettersAction(): Promise<ActionResponse<LetterPublic[]>> {
    return withActionResponse(async () => {
        const letters = await repository.queryGSI2<LetterEntity>('LETTER', 'COMPLETE', false);
        return letters.map(toLetterPublic);
    });
}

/**
 * 편지 삭제
 */
export async function deleteLetterAction(
    userId: string,
    letterId: string,
): Promise<ActionResponse<boolean>> {
    console.log('deleteLetterAction', userId, letterId);
    return withActionResponse(async () => {
        try {
            await repository.delete(LetterKeys.pk(userId), LetterKeys.sk(letterId));
            return true;
        } catch (error) {
            console.error('Error deleting letter:', error);
            throw new Error('편지 삭제에 실패했습니다.');
        }
    });
}

/**
 * 여러 편지 삭제
 */
export async function deleteMultipleLettersAction(
    letterIds: string[],
): Promise<ActionResponse<string>> {
    return withActionResponse(async () => {
        const userId = await getUserIdBySession();

        const results = await Promise.all(
            letterIds.map(async letterId => {
                try {
                    await repository.delete(UserKeys.pk(userId), LetterKeys.sk(letterId));
                    return true;
                } catch (error) {
                    console.error('Error deleting letter:', error);
                    return false;
                }
            }),
        );

        // 모든 삭제 작업이 성공했는지 확인
        const allSucceeded = results.every(result => result === true);

        if (!allSucceeded) {
            throw new Error('일부 편지 삭제에 실패했습니다.');
        }

        return `${letterIds.length}개의 편지가 삭제되었습니다.`;
    });
}

/**
 * 결제 상태 업데이트
 */
export async function updatePaymentStatusAction(
    userId: string,
    letterId: string,
    paymentStatus: PaymentStatus,
): Promise<ActionResponse<LetterPublic>> {
    return withActionResponse(async () => {
        const normalizedUserId = userId.replace('USER#', '');
        const now = getCurrentISOTime();

        const updates: Partial<LetterEntity> = {
            paymentStatus,
            isDraft: false,
        };

        if (paymentStatus === 'complete') {
            updates.paymentCompletedAt = now;
        }

        const updatedLetter = await repository.update<LetterEntity>(
            UserKeys.pk(normalizedUserId),
            LetterKeys.sk(letterId),
            updates,
        );

        return toLetterPublic(updatedLetter);
    });
}

/**
 * 배송 상태 업데이트
 */
export async function updateShippingStatusAction(
    userId: string,
    letterId: string,
    shippingStatus: ShippingStatus,
): Promise<ActionResponse<LetterPublic>> {
    return withActionResponse(async () => {
        const normalizedUserId = userId.replace('USER#', '');
        const now = getCurrentISOTime();

        const updatedLetter = await repository.update<LetterEntity>(
            UserKeys.pk(normalizedUserId),
            LetterKeys.sk(letterId),
            {
                shippingStatus,
                shippingCompletedAt: now,
            },
        );

        return toLetterPublic(updatedLetter);
    });
}

/**
 * 날짜별 편지 조회
 */
export async function getLettersByDateAction(
    date: string,
): Promise<ActionResponse<LetterPublic[]>> {
    return withActionResponse(async () => {
        console.log('date', date);
        const letters = await repository.queryGSI2<LetterEntity>('LETTER', `COMPLETE#${date}`);
        console.log('letters', letters);
        return letters.map(toLetterPublic);
    });
}

/**
 * 편지 운송장 번호 업데이트
 */
export async function updateLetterTrackingNumberAction(
    userId: string,
    letterId: string,
    trackingNumber: string,
): Promise<ActionResponse<LetterPublic>> {
    return withActionResponse(async () => {
        const updatedLetter = await repository.update<LetterEntity>(
            UserKeys.pk(userId),
            LetterKeys.sk(letterId),
            {
                trackingNumber,
            },
        );

        return toLetterPublic(updatedLetter);
    });
}

/**
 * 특정 사용자의 편지 목록 조회
 */
export async function getLettersByUserIdAction(
    userId: string,
): Promise<ActionResponse<LetterPublic[]>> {
    return withActionResponse(async () => {
        const normalizedUserId = removeTableKeyPrefix(userId);

        console.log('normalizedUserId', normalizedUserId);
        // 사용자의 편지 목록 조회
        const letters = await repository.query<LetterEntity>(
            UserKeys.pk(normalizedUserId),
            'LETTER#',
        );

        // 엔티티를 Public 타입으로 변환
        const publicLetters = letters.map(toLetterPublic).filter(letter => !letter.isDraft); // 임시저장 제외

        return publicLetters;
    });
}
