export interface DynamoEntity {
    PK: string;
    SK: string;
    GSI1PK?: string;
    GSI1SK?: string;
    GSI2PK?: string;
    GSI2SK?: string;
    EntityType: string;
}

/**
 * 모든 공개 타입에서 제외될 DynamoDB 관련 필드
 */
export type DynamoDBFields = 'GSI1PK' | 'GSI1SK' | 'GSI2PK' | 'GSI2SK' | 'EntityType';

/**
 * DynamoDB 엔티티에서 공개 타입으로 변환하는 기본 유틸리티 함수
 */
export function toPublicEntity<T extends DynamoEntity, K extends keyof T>(
    entity: T,
    additionalOmitFields: K[] = [],
): Omit<T, DynamoDBFields | K> {
    // DynamoDB 필드와 추가로 지정된 필드 제외
    const fieldsToOmit = [
        'GSI1PK',
        'GSI1SK',
        'GSI2PK',
        'GSI2SK',
        'EntityType',
        ...additionalOmitFields,
    ];

    // 필드 복사를 위한 새 객체 생성
    const publicEntity = { ...entity };

    // 제외할 필드 삭제
    for (const field of fieldsToOmit) {
        delete publicEntity[field as keyof typeof publicEntity];
    }

    return publicEntity as Omit<T, DynamoDBFields | K>;
}

/**
 * 현재 시간을 ISO 문자열로 반환
 */
export function getISOTimestamp(): string {
    return new Date().toISOString();
}

/**
 * 엔티티별 PK/SK 생성 패턴을 위한 타입 정의
 */
export interface EntityKeyPattern {
    pk: (_id: string) => string;
    sk: (_id: string) => string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gsi1pk?: (_params: any) => string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gsi1sk?: (_params: any) => string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gsi2pk?: (_params: any) => string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gsi2sk?: (_params: any) => string;
}
