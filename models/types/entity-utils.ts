/* eslint-disable no-unused-vars */
import { DynamoEntity, EntityKeyPattern } from './dynamo';

/**
 * 엔티티 정의 인터페이스
 * 각 엔티티 타입별로 이 인터페이스를 구현하여 일관된 작업을 수행할 수 있게 함
 */
export interface EntityDefinition<Entity extends DynamoEntity, Input, Public> {
    /** 엔티티 타입 (DynamoDB EntityType 값) */
    entityType: string;

    /** 키 생성 패턴 */
    keys: EntityKeyPattern;

    /** 입력을 엔티티로 변환하는 함수 */
    createEntityFromInput: (
        input: Input,
        id: string,
        timestamp?: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...args: any[]
    ) => Partial<Entity>;

    /** 엔티티를 공개 타입으로 변환하는 함수 */
    toPublic: (entity: Entity) => Public;

    /** DynamoDB 테이블 이름 */
    tableName: string;
}
