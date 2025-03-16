import { DynamoEntity, EntityKeyPattern, getISOTimestamp } from './dynamo';

/**
 * 템플릿 엔티티 키 생성 패턴
 */
export const TemplateKeys: EntityKeyPattern = {
    pk: (templateId: string) => `TEMPLATE#${templateId}`,
    sk: (templateId: string) => `TEMPLATE#${templateId}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gsi1pk: (_: any = null) => 'TEMPLATE',
    gsi1sk: (timestamp: string) => timestamp,
};

/**
 * 클라이언트에서 템플릿 생성/수정 시 사용하는 입력 타입
 */
export interface TemplateInput {
    name: string;
    description: string;
    category: string;

    initialQuantity: {
        paper: number;
        photo: number;
    };

    initialPrice: number;
    discountedPrice: number;

    additionalUnitPrice: {
        paper: number;
        photo: number;
    };

    isPopular: boolean;

    paperImage: string;
    thumbnail: string;

    // 기존 템플릿 수정 시 사용될 ID (새 템플릿은 불필요)
    id?: string;
}

export interface TemplateEntity extends DynamoEntity {
    name: string;
    description: string;
    category: string;

    initialQuantity: {
        paper: number;
        photo: number;
    };

    initialPrice: number;
    discountedPrice: number;

    additionalUnitPrice: {
        paper: number;
        photo: number;
    };

    isPopular: boolean;

    paperImage: string;
    thumbnail: string;

    createdAt: string;

    EntityType: 'TEMPLATE';
}

export type TemplatePublic = Omit<
    TemplateEntity,
    'GSI1PK' | 'GSI1SK' | 'GSI2PK' | 'GSI2SK' | 'EntityType'
>;

export const toTemplatePublic = (template: TemplateEntity): TemplatePublic => {
    const {
        EntityType: _EntityType,
        GSI1PK: _GSI1PK,
        GSI1SK: _GSI1SK,
        GSI2PK: _GSI2PK,
        GSI2SK: _GSI2SK,
        ...publicTemplate
    } = template;
    return publicTemplate;
};

/**
 * TemplateInput에서 TemplateEntity 생성을 위한 유틸리티 함수
 */
export const createTemplateEntityFromInput = (
    input: TemplateInput,
    templateId: string,
    timestamp = getISOTimestamp(),
): Partial<TemplateEntity> => {
    return {
        PK: TemplateKeys.pk(templateId),
        SK: TemplateKeys.sk(templateId),
        name: input.name,
        description: input.description,
        category: input.category,
        initialQuantity: input.initialQuantity,
        initialPrice: input.initialPrice,
        discountedPrice: input.discountedPrice,
        additionalUnitPrice: input.additionalUnitPrice,
        isPopular: input.isPopular,
        paperImage: input.paperImage,
        thumbnail: input.thumbnail,
        createdAt: timestamp,
        GSI1PK: TemplateKeys.gsi1pk!(null),
        GSI1SK: TemplateKeys.gsi1sk!(timestamp),
        EntityType: 'TEMPLATE',
    };
};

/**
 * 템플릿 수정을 위한 유틸리티 함수
 * 기존 템플릿의 ID를 사용하여 엔티티를 업데이트합니다.
 */
export const updateTemplateEntityFromInput = (input: TemplateInput): Partial<TemplateEntity> => {
    if (!input.id) {
        throw new Error('템플릿 수정 시 ID가 필요합니다.');
    }

    return {
        PK: TemplateKeys.pk(input.id),
        SK: TemplateKeys.sk(input.id),
        name: input.name,
        description: input.description,
        category: input.category,
        initialQuantity: input.initialQuantity,
        initialPrice: input.initialPrice,
        discountedPrice: input.discountedPrice,
        additionalUnitPrice: input.additionalUnitPrice,
        isPopular: input.isPopular,
        paperImage: input.paperImage,
        thumbnail: input.thumbnail,
        // 생성 날짜는 업데이트하지 않음
        GSI1PK: TemplateKeys.gsi1pk!(null),
        // GSI1SK는 생성 날짜 기준으로 유지
        EntityType: 'TEMPLATE',
    };
};
