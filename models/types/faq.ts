import { FAQCategory } from '@/constants/data/faq-categories';
import { DynamoEntity, EntityKeyPattern, getISOTimestamp } from './dynamo';

/**
 * FAQ 엔티티 키 생성 패턴
 */
export const FaqKeys: EntityKeyPattern = {
    pk: (faqId: string) => `FAQ#${faqId}`,
    sk: (faqId: string) => `FAQ#${faqId}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gsi1pk: (_: any = null) => 'FAQ',
    gsi1sk: (timestamp: string) => timestamp,
};

/**
 * 클라이언트에서 FAQ 생성/수정 시 사용하는 입력 타입
 */
export interface FaqInput {
    question: string;
    answer: string;
    category: FAQCategory;
    order: number;
    isPublished: boolean;
    // 기존 FAQ 수정 시 사용될 ID (새 FAQ는 불필요)
    id?: string;
}

/**
 * FAQ 엔티티 타입 정의
 */
export interface FaqEntity extends DynamoEntity {
    question: string;
    answer: string;
    category: FAQCategory;
    order: number;
    isPublished: boolean;
    createdAt: string;
    EntityType: 'FAQ';
}

/**
 * 공개 FAQ 타입
 */
export type FaqPublic = Omit<FaqEntity, 'GSI1PK' | 'GSI1SK' | 'GSI2PK' | 'GSI2SK' | 'EntityType'>;

/**
 * FAQ 엔티티를 공개 타입으로 변환
 */
export const toFaqPublic = (faq: FaqEntity): FaqPublic => {
    const {
        GSI1PK: _GSI1PK,
        GSI1SK: _GSI1SK,
        GSI2PK: _GSI2PK,
        GSI2SK: _GSI2SK,
        EntityType: _EntityType,
        ...publicFaq
    } = faq;
    return publicFaq;
};

/**
 * FAQ 입력을 엔티티로 변환
 */
export const createFaqEntityFromInput = (
    input: FaqInput,
    faqId: string,
    timestamp = getISOTimestamp(),
): Partial<FaqEntity> => {
    return {
        PK: FaqKeys.pk(faqId),
        SK: FaqKeys.sk(faqId),
        question: input.question,
        answer: input.answer,
        category: input.category,
        order: input.order,
        isPublished: input.isPublished,
        createdAt: timestamp,
        GSI1PK: FaqKeys.gsi1pk!(null),
        GSI1SK: FaqKeys.gsi1sk!(timestamp),
        EntityType: 'FAQ',
    };
};
