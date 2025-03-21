'use server';

import { getUserIdBySession } from '@/lib/auth';
import { Repository } from '@/services/repository';
import { Resource } from 'sst';
import { v4 as uuidv4 } from 'uuid';
import { ActionResponse, withActionResponse } from '../types/response';
import { 
    PointLogEntity, 
    PointLogPublic, 
    toPointLogPublic, 
    PointLogInput,
    createPointLogEntityFromInput,
    PointLogKeys,
} from '../types/point-log';
import { removeTableKeyPrefix } from '@/lib/api-utils';
import { UserKeys } from '../types/user';

const repository = new Repository(Resource.FromYouTable.name);

/**
 * 포인트 변경 내역 기록
 */
export const logPointAction = async (
    changeAmount: number,
    reason: string,
    targetUserId?: string,
): Promise<ActionResponse<PointLogPublic>> => {
    return withActionResponse(async () => {
        const userId = targetUserId ?? (await getUserIdBySession());
        const normalizedId = removeTableKeyPrefix(userId);
        const logId = uuidv4();
        const now = new Date().toISOString();

        // PointLogInput 생성
        const input: PointLogInput = {
            userId: normalizedId,
            changeAmount,
            reason,
            userData: {
                PK: UserKeys.pk(normalizedId),
                SK: UserKeys.sk(normalizedId),
            },
        };

        // 포인트 로그 엔티티 생성
        const logEntity = createPointLogEntityFromInput(input, logId, now);

        // 저장
        await repository.put(logEntity as PointLogEntity);

        return toPointLogPublic(logEntity as PointLogEntity);
    });
};

/**
 * 모든 포인트 로그 조회
 */
export const getAllPointLogsAction = async (): Promise<
    ActionResponse<PointLogPublic[]>
> => {
    return withActionResponse(async () => {
        const pointLogs = await repository.queryGSI1<PointLogEntity>('POINT_LOG', undefined, false);
        return pointLogs.map(toPointLogPublic);
    });
};

/**
 * 내 포인트 로그 조회
 */
export const getMyPointLogsAction = async (): Promise<
    ActionResponse<PointLogPublic[]>
> => {
    return withActionResponse(async () => {
        const userId = await getUserIdBySession();
        const normalizedId = removeTableKeyPrefix(userId);
        const pointLogs = await repository.query<PointLogEntity>(
            PointLogKeys.pk(normalizedId),
            'POINTLOG#',
            true,
        );
        return pointLogs.map(toPointLogPublic);
    });
};

/**
 * 특정 사용자의 포인트 로그 조회
 */
export const getUserPointLogsAction = async (
    userId: string,
): Promise<ActionResponse<PointLogPublic[]>> => {
    return withActionResponse(async () => {
        const normalizedId = removeTableKeyPrefix(userId);
        const pointLogs = await repository.query<PointLogEntity>(
            PointLogKeys.pk(normalizedId),
            'POINTLOG#',
            true,
        );
        return pointLogs.map(toPointLogPublic);
    });
};
