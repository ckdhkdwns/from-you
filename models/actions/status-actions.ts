'use server';

import { Repository } from '@/services/repository';
import { Resource } from 'sst';
import { logPointAction } from './point-action';
import { POINT_CHANGE_REASON } from '@/constants/data/point-change-reason';
import { ActionResponse, withActionResponse } from '../types/response';
import { LetterEntity } from '../types/letter';
import { UserEntity, UserKeys } from '../types/user';
import { LetterKeys } from '../types/letter';

// Repository 인스턴스 생성
const repository = new Repository(Resource.FromYouTable.name);

/**
 * 배송 완료시 포인트 지급 위한 함수
 * @param userId - 사용자 ID
 * @param letterId - 편지 ID
 */
export async function confirmShippingComplete(
    userId: string,
    letterId: string,
): Promise<ActionResponse<{ user: UserEntity; letter: LetterEntity }>> {
    return withActionResponse(async () => {
        const letter = await repository.get<LetterEntity>(
            LetterKeys.pk(userId),
            LetterKeys.sk(letterId),
        );

        if (!letter) {
            throw new Error('편지를 찾을 수 없습니다.');
        }

        // 포인트 변화량 (타입 오류 수정)
        const pointChange = letter.pointInfo?.earnPointAmount || 0;

        // TransactionBuilder 사용하여 트랜잭션 구성
        const result = await repository
            .transaction()
            // 사용자 포인트 증가
            .updateItem<Partial<UserEntity>>(
                UserKeys.pk(userId),
                UserKeys.sk(userId),
                { point: pointChange },
                'ADD',
            )
            // 편지 배송 상태 업데이트
            .updateItem<Partial<LetterEntity>>(
                LetterKeys.pk(userId),
                LetterKeys.sk(letterId),
                {
                    shippingStatus: 'complete',
                    shippingCompletedAt: new Date().toISOString(),
                },
            )
            // 트랜잭션 실행 및 결과 반환
            .executeAndGet<UserEntity | LetterEntity>();

        // 포인트 로그 기록 (0보다 큰 경우에만)
        if (pointChange > 0) {
            await logPointAction(
                pointChange,
                POINT_CHANGE_REASON.SHIPPING_COMPLETE.value,
                userId,
            );
        }

        return {
            user: result[0] as UserEntity,
            letter: result[1] as LetterEntity,
        };
    });
}
