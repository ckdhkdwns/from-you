import { TemplateEntity } from './template';
import { DynamoEntity, EntityKeyPattern, getISOTimestamp } from './dynamo';

/**
 * 리뷰 엔티티 키 생성 패턴
 */
export const ReviewKeys: EntityKeyPattern = {
    pk: (userId: string) => `USER#${userId}`,
    sk: (reviewId: string) => `REVIEW#${reviewId}`,
    gsi1pk: () => `REVIEW`,
    gsi1sk: (createdAt: string) => createdAt,
    gsi2pk: (templateId: string) => `TEMPLATE#${templateId}`,
    gsi2sk: (createdAt: string) => `${createdAt}`,
};

/**
 * 클라이언트에서 리뷰 생성/수정 시 사용하는 입력 타입
 */
export interface ReviewInput {
    rating: number;
    content: string;
    letterId: string;

    // 기존 리뷰 수정 시 사용될 ID (새 리뷰는 불필요)
    id?: string;
}

/**
 * 리뷰 폼 데이터 (기존 인터페이스 유지)
 */
export interface ReviewFormData {
    rating: number;
    content: string;
}

/**
 * 리뷰 엔티티 타입 정의
 */
export interface ReviewEntity extends DynamoEntity {
    userId: string;
    letterId: string;
    rating: number;
    content: string;
    createdAt: string;
    template?: Partial<TemplateEntity>;
    earnPointAmount: number;
    isBest?: boolean;
    EntityType: 'REVIEW';
}

/**
 * 공개 리뷰 타입
 */
export type ReviewPublic = Omit<
    ReviewEntity,
    'GSI1PK' | 'GSI1SK' | 'GSI2PK' | 'GSI2SK' | 'EntityType'
>;

/**
 * 리뷰 엔티티를 공개 타입으로 변환
 */
export const toReviewPublic = (review: ReviewEntity): ReviewPublic => {
    const {
        GSI1PK: _GSI1PK,
        GSI1SK: _GSI1SK,
        GSI2PK: _GSI2PK,
        GSI2SK: _GSI2SK,
        EntityType: _EntityType,
        ...publicReview
    } = review;
    return publicReview;
};

/**
 * 리뷰 입력을 엔티티로 변환
 */
export const createReviewEntityFromInput = (
    input: ReviewInput,
    reviewId: string,
    userId: string,
    earnPointAmount: number = 0,
    timestamp = getISOTimestamp(),
): Partial<ReviewEntity> => {
    return {
        PK: ReviewKeys.pk(reviewId),
        SK: ReviewKeys.sk(reviewId),
        userId,
        letterId: input.letterId,
        rating: input.rating,
        content: input.content,
        earnPointAmount,
        createdAt: timestamp,
        GSI1PK: ReviewKeys.gsi1pk!(input.letterId),
        GSI1SK: ReviewKeys.gsi1sk!(userId),
        GSI2PK: ReviewKeys.gsi2pk!(userId),
        GSI2SK: ReviewKeys.gsi2sk!(timestamp),
        EntityType: 'REVIEW',
    };
};
