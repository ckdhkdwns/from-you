import { DynamoEntity, EntityKeyPattern, getISOTimestamp } from './dynamo';

/**
 * 모든 엔티티 타입에 공통으로 사용될 기본 구조
 */
export interface BaseEntityDef<Entity, Input> {
    /**
     * 엔티티 타입명
     */
    entityType: string;

    /**
     * 키 패턴
     */
    keys: EntityKeyPattern;

    /**
     * 입력을 엔티티로 변환
     */

    createEntityFromInput: (
        _input: Input,
        _id: string,
        _timestamp?: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ..._args: any[]
    ) => Partial<Entity>;

    /**
     * 엔티티를 퍼블릭 타입으로 변환
     */
    toPublic: <PublicType>(_entity: Entity) => PublicType;
}

/**
 * DynamoDB 인덱스 타입
 */
export type GSIIndex = 'GSI1' | 'GSI2' | 'GSI3';

/**
 * DynamoDB 엔티티 기본 작업 인터페이스
 */

export interface EntityOperations<_Entity extends DynamoEntity, Input, PublicType> {
    /**
     * 엔티티 생성
     */
    create: (_input: Input, _userId?: string) => Promise<PublicType>;

    /**
     * ID로 엔티티 조회
     */
    getById: (_id: string, _userId?: string) => Promise<PublicType | null>;

    /**
     * 엔티티 업데이트
     */
    update: (_id: string, _input: Partial<Input>, _userId?: string) => Promise<PublicType>;

    /**
     * ID로 엔티티 삭제
     */
    delete: (_id: string, _userId?: string) => Promise<boolean>;

    /**
     * 조건에 맞는 모든 엔티티 조회
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    list: (_params?: any) => Promise<PublicType[]>;
}

/**
 * 표준 생성 날짜 필드를 포함하는 베이스 엔티티
 */
export interface BaseEntityFields {
    createdAt: string;
}

/**
 * 날짜 필드 설정 유틸리티 함수
 *
 * @param entity 엔티티 객체
 * @returns 날짜 필드가 추가된 엔티티
 */
export const setTimestamps = <T extends Partial<BaseEntityFields>>(entity: T): T => {
    return {
        ...entity,
        createdAt: getISOTimestamp(),
    };
};
