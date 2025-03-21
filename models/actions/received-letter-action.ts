'use server';

import { removeTableKeyPrefix } from '@/lib/api-utils';
import { Repository } from '@/services/repository';
import { Resource } from 'sst';
import { ActionResponse, withActionResponse } from '../types/response';
import {
    ReceivedLetterEntity,
    ReceivedLetterPublic,
    toReceivedLetterPublic,
    ReceivedLetterInput,
    createReceivedLetterEntityFromInput,
    ReceivedLetterKeys,
} from '../types/received-letter';
import { v4 as uuidv4 } from 'uuid';
import { getUserIdBySession } from '@/lib/auth';
import { Photo } from '../types/letter';
import { parsePhotos } from '@/app/(no-header)/write/_libs/parse-photos';
import { UserEntity, UserKeys } from '../types/user';
import { getCurrentISOTime } from '@/lib/date';

// Repository 인스턴스 생성
const repository = new Repository(Resource.FromYouTable.name);

/**
 * 모든 받은 편지 조회
 */
export const getReceivedLettersAction = async (): Promise<
    ActionResponse<ReceivedLetterPublic[]>
> => {
    return withActionResponse(async () => {
        const receivedLetters = await repository.queryGSI1<ReceivedLetterEntity>(
            'RECEIVED_LETTER',
            undefined,
            false,
        );
        return receivedLetters.map(toReceivedLetterPublic);
    });
};

/**
 * 새 받은 편지 생성
 */
export const createReceivedLetterAction = async (
    input: ReceivedLetterInput,
    photos: Photo[],
): Promise<ActionResponse<ReceivedLetterPublic>> => {
    return withActionResponse(async () => {
        const id = uuidv4();
        const now = getCurrentISOTime();

        // 사용자 ID 추출 (user.PK가 있으면 사용, 아니면 세션에서 가져옴)
        let userId = '';
        if (input.user?.PK) {
            userId = removeTableKeyPrefix(input.user.PK);
        } else {
            userId = await getUserIdBySession();
        }

        const user = await repository.get<UserEntity>(UserKeys.pk(userId), UserKeys.sk(userId));
        const parsedPhotos = await parsePhotos(photos);

        const newLetter = createReceivedLetterEntityFromInput(input, user, id, now, parsedPhotos);

        await repository.put(newLetter as ReceivedLetterEntity);
        return toReceivedLetterPublic(newLetter as ReceivedLetterEntity);
    });
};

/**
 * 받은 편지 업데이트
 */
export const updateReceivedLetterAction = async (
    input: ReceivedLetterInput,
): Promise<ActionResponse<ReceivedLetterPublic>> => {
    return withActionResponse(async () => {
        if (!input.id) {
            throw new Error('편지 ID가 필요합니다.');
        }

        // 사용자 ID 추출 (user.PK가 있으면 사용, 아니면 세션에서 가져옴)

        let userId = '';
        if (input.user?.PK) {
            userId = removeTableKeyPrefix(input.user.PK);
        } else {
            userId = await getUserIdBySession();
        }

        const letterId = input.id;
        console.log(input);
        const user = await repository.get<UserEntity>(UserKeys.pk(userId), UserKeys.sk(userId));

        // 기존 항목 가져오기
        const existingItem = await repository.get<ReceivedLetterEntity>(
            ReceivedLetterKeys.pk(userId),
            ReceivedLetterKeys.sk(letterId),
        );

        console.log('existingItem', existingItem);
        if (!existingItem) {
            throw new Error('편지를 찾을 수 없습니다.');
        }

        // 기존 항목의 GSI1SK 값을 유지하면서 새로운 정보로 업데이트
        const now = getCurrentISOTime();

        // 사진 처리
        const parsedPhotos = input.photos ? await parsePhotos(input.photos) : existingItem.photos;

        const updatedLetter = {
            ...createReceivedLetterEntityFromInput(
                input,
                user,
                letterId,
                existingItem.createdAt,
                parsedPhotos,
            ),
            GSI1SK: existingItem.GSI1SK,
            updatedAt: now,
        };

        await repository.put(updatedLetter as ReceivedLetterEntity);
        return toReceivedLetterPublic(updatedLetter as ReceivedLetterEntity);
    });
};

/**
 * 받은 편지 삭제
 * 단일 ID 또는 ID 배열을 받아 해당 편지들을 삭제합니다.
 */
export const deleteReceivedLetterAction = async (
    ids: { userId: string; letterId: string } | { userId: string; letterIds: string[] },
): Promise<ActionResponse<{ successCount: number; failedIds: string[] }>> => {
    return withActionResponse(async () => {
        // idArray 구성
        let idArray = [];
        if ('letterIds' in ids) {
            // 여러 ID가 들어온 경우
            idArray = ids.letterIds.map(letterId => ({
                userId: ids.userId,
                letterId,
            }));
        } else {
            // 단일 ID가 들어온 경우
            idArray = [ids];
        }

        let successCount = 0;
        const failedIds: string[] = [];

        // 각 편지를 순차적으로 삭제
        for (const id of idArray) {
            const { userId, letterId } = id;
            try {
                await repository.delete(
                    ReceivedLetterKeys.pk(removeTableKeyPrefix(userId)),
                    ReceivedLetterKeys.sk(removeTableKeyPrefix(letterId)),
                );
                successCount++;
            } catch (error) {
                console.error(`편지 ID ${letterId} 삭제 오류:`, error);
                failedIds.push(letterId);
            }
        }

        return {
            successCount,
            failedIds,
        };
    });
};

/**
 * ID로 받은 편지 조회
 */
export const getReceivedLetterByIdAction = async ({
    userId,
    letterId,
}: {
    userId: string;
    letterId: string;
}): Promise<ActionResponse<ReceivedLetterPublic>> => {
    return withActionResponse(async () => {
        const letter = await repository.get<ReceivedLetterEntity>(
            ReceivedLetterKeys.pk(removeTableKeyPrefix(userId)),
            ReceivedLetterKeys.sk(removeTableKeyPrefix(letterId)),
        );
        return toReceivedLetterPublic(letter);
    });
};
