import { DynamoEntity, EntityKeyPattern, getISOTimestamp } from './dynamo';
import { UserEntity } from './user';

/**
 * 포인트 로그 엔티티 키 생성 패턴
 */
export const PointLogKeys: EntityKeyPattern = {
    pk: (userId: string) => `USER#${userId}`,
    sk: (pointLogId: string) => `POINTLOG#${pointLogId}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gsi1pk: (_: any = null) => 'POINT_LOG',
    gsi1sk: (timestamp: string) => timestamp,
};

/**
 * 클라이언트에서 포인트 로그 생성 시 사용하는 입력 타입
 */
export interface PointLogInput {
    userId: string;
    changeAmount: number;
    reason: string;
    userData?: Partial<UserEntity>;
}

/**
 * 포인트 로그 엔티티 타입
 */
export interface PointLogEntity extends DynamoEntity {
    user: Partial<UserEntity>;
    changeAmount: number;
    reason: string;
    createdAt: string;
    EntityType: 'POINT_LOG';
}

/**
 * 공개 포인트 로그 타입
 */
export type PointLogPublic = Omit<
    PointLogEntity,
    'GSI1PK' | 'GSI1SK' | 'GSI2PK' | 'GSI2SK' | 'EntityType'
>;

/**
 * 포인트 로그 엔티티를 공개 타입으로 변환
 */
export const toPointLogPublic = (pointLog: PointLogEntity): PointLogPublic => {
    const {
        GSI1PK: _GSI1PK,
        GSI1SK: _GSI1SK,
        GSI2PK: _GSI2PK,
        GSI2SK: _GSI2SK,
        EntityType: _EntityType,
        ...publicPointLog
    } = pointLog;
    return publicPointLog;
};

/**
 * 포인트 로그 입력을 엔티티로 변환 - EntityDefinition 패턴에 맞게 수정
 */
export const createPointLogEntityFromInput = (
    input: PointLogInput,
    pointLogId: string,
    timestamp = getISOTimestamp(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
): Partial<PointLogEntity> => {
    // args[0]가 있으면 사용하고, 없으면 input에서 userData를 사용
    const userData = args[0] || input.userData || { id: input.userId };

    return {
        PK: PointLogKeys.pk(input.userId),
        SK: PointLogKeys.sk(pointLogId),
        user: userData,
        changeAmount: input.changeAmount,
        reason: input.reason,
        createdAt: timestamp,
        GSI1PK: PointLogKeys.gsi1pk!(null),
        GSI1SK: PointLogKeys.gsi1sk!(timestamp),
        EntityType: 'POINT_LOG',
    };
};
