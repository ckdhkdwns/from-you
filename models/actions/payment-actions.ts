'use server';

import { Resource } from 'sst';
import { Repository } from '@/services/repository';
import { getUserIdBySession } from '@/lib/auth';
import { generateOrderId } from '@/lib/order-utils';
import { logPointAction } from './point-action';
import { POINT_CHANGE_REASON } from '@/constants/data/point-change-reason';
import {
    LetterEntity,
    LetterPublic,
    toLetterPublic,
    LetterKeys,
    LetterInput,
} from '../types/letter';
import { UserEntity, UserPublic, toUserPublic, UserKeys } from '../types/user';
import { ActionResponse, withActionResponse } from '../types/response';
import { verifyTossPaymentWithAPI } from './toss/vertify';
import { getCurrentISOTime } from '@/lib/date';

// Repository 인스턴스 생성
const repository = new Repository(Resource.FromYouTable.name);

/**
 * 계좌이체 결제 요청
 */
export async function initiateAccountTransferPaymentAction(
    letter: LetterInput,
): Promise<ActionResponse<{ user: UserPublic; letter: LetterPublic }>> {
    return withActionResponse(async () => {
        const userId = await getUserIdBySession();
        const letterId = letter.id;
        const orderId = generateOrderId();
        const now = getCurrentISOTime();

        const transferLetter: Partial<LetterEntity> = {
            ...letter,
            orderId,
            shippingStatus: 'pending',
            paymentStatus: 'pending',
            paymentMethod: 'transfer',
            transferRequestedAt: now,
            isDraft: false,
            GSI2PK: 'LETTER',
            GSI2SK: `COMPLETE#${now}`,
        };

        // TransactionBuilder를 사용한 트랜잭션 실행
        const transaction = repository.transaction();

        // 포인트 차감 업데이트
        transaction.updateItem<Partial<UserEntity>>(
            UserKeys.pk(userId),
            UserKeys.sk(userId),
            { point: -letter.pointInfo!.usePointAmount },
            'ADD',
        );

        // 편지 업데이트
        transaction.updateItem<Partial<LetterEntity>>(
            LetterKeys.pk(userId),
            LetterKeys.sk(letterId),
            transferLetter,
        );

        // 트랜잭션 실행 및 결과 조회
        const [updatedUser, updatedLetter] = await transaction.executeAndGet();

        // 포인트 사용 로그 기록
        if (letter.pointInfo?.usePointAmount > 0) {
            await logPointAction(
                -letter.pointInfo.usePointAmount,
                POINT_CHANGE_REASON.LETTER_DISCOUNT.value,
                userId,
            );
        }

        return {
            user: toUserPublic(updatedUser as UserEntity),
            letter: toLetterPublic(updatedLetter as LetterEntity),
        };
    });
}

/**
 * 토스페이 결제 요청
 */
export async function initiateTossPaymentAction(
    letter: LetterInput,
    paymentMethod: string,
): Promise<ActionResponse<LetterPublic>> {
    return withActionResponse(async () => {
        const userId = await getUserIdBySession();
        const orderId = generateOrderId();
        const letterId = letter.id;

        const tossLetter: Partial<LetterEntity> = {
            ...letter,
            orderId,
            shippingStatus: 'pending',
            paymentStatus: 'pending',
            paymentMethod,
        };

        const updatedLetter = await repository.update<LetterEntity>(
            UserKeys.pk(userId),
            LetterKeys.sk(letterId),
            tossLetter,
        );

        return toLetterPublic(updatedLetter);
    });
}

/**
 * 포인트 결제 요청
 */
export async function processPointOnlyPaymentAction(
    letter: LetterInput,
): Promise<ActionResponse<{ user: UserPublic; letter: LetterPublic }>> {
    return withActionResponse(async () => {
        const userId = await getUserIdBySession();
        const orderId = generateOrderId();
        const now = getCurrentISOTime();
        const letterSK = letter.id;

        const pointLetter: Partial<LetterEntity> = {
            ...letter,
            orderId,
            paymentStatus: 'complete',
            paymentMethod: 'point',
            isDraft: false,
            shippingStatus: 'pending',
            paymentCompletedAt: now,
            GSI2PK: 'LETTER',
            GSI2SK: `COMPLETE#${now}`,
        };

        // TransactionBuilder를 사용한 트랜잭션 실행
        const transaction = repository.transaction();

        // 포인트 차감 업데이트
        transaction.updateItem<Partial<UserEntity>>(
            UserKeys.pk(userId),
            UserKeys.sk(userId),
            { point: -letter.pointInfo!.usePointAmount },
            'ADD',
        );

        // 편지 업데이트
        transaction.updateItem<Partial<LetterEntity>>(UserKeys.pk(userId), letterSK, pointLetter);

        // 트랜잭션 실행 및 결과 조회
        const [updatedUser, updatedLetter] = await transaction.executeAndGet();

        // 포인트 사용 로그 기록
        if (letter.pointInfo?.usePointAmount > 0) {
            await logPointAction(
                -letter.pointInfo.usePointAmount,
                POINT_CHANGE_REASON.LETTER_DISCOUNT.value,
                userId,
            );
        }

        return {
            user: toUserPublic(updatedUser as UserEntity),
            letter: toLetterPublic(updatedLetter as LetterEntity),
        };
    });
}

/**
 * 토스페이 결제 확인 및 완료 처리
 */
export async function verifyAndCompleteTossPayment({
    orderId,
    amount,
    paymentKey,
    letterId,
}: {
    orderId: string;
    amount: string;
    paymentKey: string;
    letterId: string;
}): Promise<ActionResponse<{ user: UserPublic; letter: LetterPublic }>> {
    return withActionResponse(async () => {
        const userId = await getUserIdBySession();

        const now = getCurrentISOTime();

        // 편지 데이터 조회
        const letter = await repository.get<LetterEntity>(
            UserKeys.pk(userId),
            LetterKeys.sk(letterId),
        );

        if (!letter) {
            throw new Error('편지를 찾을 수 없습니다.');
        }

        const handshakeResult = await verifyTossPaymentWithAPI({
            orderId,
            amount,
            paymentKey,
        });

        if (!handshakeResult) {
            throw new Error('결제 실패');
        }

        // TransactionBuilder를 사용한 트랜잭션 실행
        const transaction = repository.transaction();

        // 포인트 차감 업데이트
        transaction.updateItem<Partial<UserEntity>>(
            UserKeys.pk(userId),
            UserKeys.sk(userId),
            { point: -letter.pointInfo!.usePointAmount },
            'ADD',
        );

        // 편지 결제 완료 상태로 업데이트
        transaction.updateItem<Partial<LetterEntity>>(
            UserKeys.pk(userId),
            LetterKeys.sk(letterId),
            {
                isDraft: false,
                paymentStatus: 'complete',
                paymentCompletedAt: now,
                GSI2PK: 'LETTER',
                GSI2SK: `COMPLETE#${now}`,
            },
        );

        // 트랜잭션 실행 및 결과 조회
        const [updatedUser, updatedLetter] = await transaction.executeAndGet();

        // 포인트 사용 로그 기록
        if (letter.pointInfo?.usePointAmount > 0) {
            await logPointAction(
                -letter.pointInfo.usePointAmount,
                POINT_CHANGE_REASON.LETTER_DISCOUNT.value,
                userId,
            );
        }

        return {
            user: toUserPublic(updatedUser as UserEntity),
            letter: toLetterPublic(updatedLetter as LetterEntity),
        };
    });
}
