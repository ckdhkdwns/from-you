import { DynamoEntity, EntityKeyPattern, getISOTimestamp } from './dynamo';

/**
 * 인증 제공자 타입
 */
export type Provider = 'email' | 'kakao' | 'naver' | 'apple';

/**
 * 사용자 역할 타입
 */
export type UserRole = 'user' | 'admin';

/**
 * 사용자 엔티티 키 생성 패턴
 */
export const UserKeys: EntityKeyPattern = {
    pk: (userId: string) => `USER#${userId}`,
    sk: (userId: string) => `USER#${userId}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gsi1pk: (_: any = null) => 'USER',
    gsi1sk: (timestamp: string) => timestamp,
};

/**
 * 클라이언트에서 사용자 생성/수정 시 사용하는 입력 타입
 */
export interface UserInput {
    email: string;
    name?: string;
    password?: string;
    provider: Provider;
    point?: number;
    blocked?: boolean;
    role?: UserRole;

    // 기존 사용자 수정 시 사용될 ID (새 사용자는 불필요)
    id?: string;
}

/**
 * 사용자 엔티티 타입 정의
 */
export interface UserEntity extends DynamoEntity {
    email: string;
    name?: string;
    password?: string;
    point: number;
    provider: Provider;
    createdAt: string;
    blocked?: boolean;
    role?: UserRole;
    EntityType: 'USER';
}

/**
 * 공개 사용자 타입 (비밀번호 제외)
 */
export type UserPublic = Omit<
    UserEntity,
    'password' | 'GSI1PK' | 'GSI1SK' | 'GSI2PK' | 'GSI2SK' | 'EntityType'
>;

/**
 * 사용자 엔티티를 공개 타입으로 변환
 */
export const toUserPublic = (user: UserEntity): UserPublic => {
    const {
        password: _password,
        EntityType: _EntityType,
        GSI1PK: _GSI1PK,
        GSI1SK: _GSI1SK,
        GSI2PK: _GSI2PK,
        GSI2SK: _GSI2SK,
        ...publicUser
    } = user;
    return publicUser;
};

/**
 * 사용자 입력을 엔티티로 변환
 */
export const createUserEntityFromInput = (
    input: UserInput,
    userId: string,
    timestamp = getISOTimestamp(),
): Partial<UserEntity> => {
    return {
        PK: UserKeys.pk(userId),
        SK: UserKeys.sk(userId),
        email: input.email,
        name: input.name,
        password: input.password,
        point: input.point ?? 0, // 기본 포인트
        provider: input.provider,
        blocked: input.blocked,
        role: input.role ?? 'user',
        createdAt: timestamp,
        GSI1PK: UserKeys.gsi1pk!(null),
        GSI1SK: UserKeys.gsi1sk!(timestamp),
        EntityType: 'USER',
    };
};
