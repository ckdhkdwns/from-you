'use server';

import { getUserIdBySession } from '@/lib/auth';
import { Repository } from '@/services/repository';
import { Resource } from 'sst';
import { LetterEntity, LetterPublic, toLetterPublic } from '../types/letter';
import { ActionResponse, withActionResponse } from '../types/response';
import {
    ReviewEntity,
    ReviewPublic,
    toReviewPublic,
    ReviewInput,
    createReviewEntityFromInput,
    ReviewKeys,
} from '../types/review';
import { v4 as uuidv4 } from 'uuid';
import { logPointAction } from './point-action';
import { POINT_CHANGE_REASON } from '@/constants/data/point-change-reason';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';
import { UserEntity, UserKeys } from '../types/user';
import { TemplateKeys } from '../types/template';
import { getCurrentISOTime } from '@/lib/date';

// 리뷰 작성 시 포인트 적립 비율
const REVIEW_AWARD = 0.05;

// Repository 인스턴스 생성
const repository = new Repository(Resource.FromYouTable.name);

/**
 * 리뷰 작성 가능한 편지 목록 조회
 */
export async function getMyPreparedLettersAction(): Promise<ActionResponse<LetterPublic[]>> {
    return withActionResponse(async () => {
        const userId = await getUserIdBySession();
        const letters = await repository.query<LetterEntity>(UserKeys.pk(userId), 'LETTER#');

        const preparedLetters = letters.filter(
            letter =>
                letter.paymentStatus === 'complete' &&
                letter.shippingStatus === 'complete' &&
                !letter.isReviewed,
        );

        return preparedLetters.map(toLetterPublic);
    });
}

/**
 * 리뷰 생성
 */
export async function createReviewAction(
    letterId: string,
    review: Partial<ReviewEntity>,
): Promise<
    ActionResponse<{
        review: ReviewPublic;
        earnPoint: number;
    }>
> {
    return withActionResponse(async () => {
        const userId = await getUserIdBySession();

        const reviewId = uuidv4();
        const now = getCurrentISOTime();

        // 편지 정보 조회
        const letterPK = UserKeys.pk(userId);
        const letterSK = `LETTER#${letterId}`;
        const letter = await repository.get<LetterEntity>(letterPK, letterSK);

        if (!letter) {
            throw new Error('편지를 찾을 수 없습니다.');
        }

        const usePointAmount = letter.pointInfo?.usePointAmount || 0;
        const earnPointAmount =
            usePointAmount > 0 ? 0 : (letter.priceInfo?.totalPrice || 0) * REVIEW_AWARD;

        // 템플릿 정보 추출
        const templateId = removeTableKeyPrefix(letter.template?.PK);
        const templateInfo = {
            thumbnail: letter.template?.thumbnail,
            name: letter.template?.name,
        };

        // ReviewInput 생성
        const reviewInput: ReviewInput = {
            rating: review.rating || 5,
            content: review.content || '',
            letterId,
        };

        // 리뷰 엔티티 생성
        const reviewEntity = createReviewEntityFromInput(
            reviewInput,
            reviewId,
            userId,
            earnPointAmount,
            now,
        );

        // 템플릿 정보 추가
        const newReview: ReviewEntity = {
            ...(reviewEntity as ReviewEntity),
            template: templateInfo,
            PK: ReviewKeys.pk(userId), // UserKeys로 변경
            SK: ReviewKeys.sk(reviewId), // 사용자 하위에 리뷰 저장
            GSI2PK: TemplateKeys.pk(templateId), // 템플릿 ID로 변경
        };

        await repository
            .transaction()
            .updateItem<Partial<UserEntity>>(
                UserKeys.pk(userId),
                UserKeys.sk(userId), // 사용자 프로필 SK 패턴 사용
                {
                    point: earnPointAmount,
                },
                'ADD',
            )
            // 리뷰 추가
            .putItem(newReview)
            // 편지 상태 업데이트
            .updateItem<Partial<LetterEntity>>(letterPK, letterSK, {
                isReviewed: true,
            })
            .executeAndGet();

        if (earnPointAmount > 0) {
            await logPointAction(earnPointAmount, POINT_CHANGE_REASON.REVIEW.value, userId);
        }

        return {
            review: toReviewPublic(newReview),
            earnPoint: earnPointAmount,
        };
    });
}

/**
 * 내 리뷰 목록 조회
 */
export async function getMyReviewsAction(): Promise<ActionResponse<ReviewPublic[]>> {
    return withActionResponse(async () => {
        const userId = await getUserIdBySession();
        const reviews = await repository.query<ReviewEntity>(UserKeys.pk(userId), 'REVIEW#');
        return reviews.map(toReviewPublic);
    });
}

/**
 * 모든 리뷰 조회
 */
export async function getAllReviewsAction(): Promise<ActionResponse<ReviewPublic[]>> {
    return withActionResponse(async () => {
        const reviews = await repository.queryGSI1<ReviewEntity>('REVIEW', undefined, false);
        return reviews.map(toReviewPublic);
    });
}

/**
 * 리뷰 삭제
 */
export async function deleteReviewAction(
    userId: string,
    reviewId: string,
): Promise<ActionResponse<void>> {
    return withActionResponse(async () => {
        await repository.delete(UserKeys.pk(userId), ReviewKeys.sk(reviewId));
    });
}

/**
 * 여러 리뷰 삭제
 */
export async function deleteMultipleReviewsAction(
    reviews: {
        userId: string;
        reviewId: string;
    }[],
): Promise<ActionResponse<void>> {
    return withActionResponse(async () => {
        const results = await Promise.all(
            reviews.map(async review => {
                return await repository.delete(
                    UserKeys.pk(review.userId),
                    ReviewKeys.sk(review.reviewId),
                );
            }),
        );

        const allSucceeded = results.every(result => result === true);
        if (!allSucceeded) {
            throw new Error('일부 리뷰 삭제에 실패했습니다.');
        }
    });
}

/**
 * 여러 리뷰 베스트 상태 토글
 */
export async function toggleMultipleBestReviewsAction(
    reviews: {
        userId: string;
        reviewId: string;
        isBest: boolean;
    }[],
    isBest: boolean,
): Promise<ActionResponse<void>> {
    return withActionResponse(async () => {
        const transaction = repository.transaction();

        reviews.forEach(review => {
            // 리뷰 업데이트
            transaction.updateItem<Partial<ReviewEntity>>(
                UserKeys.pk(review.userId),
                ReviewKeys.sk(review.reviewId),
                {
                    isBest: isBest,
                },
            );

            // 베스트 리뷰로 등록할 경우 포인트 추가
            if (isBest) {
                transaction.updateItem<Partial<UserEntity>>(
                    UserKeys.pk(review.userId),
                    UserKeys.sk(review.userId),
                    {
                        point: 3000,
                    },
                    'ADD',
                );

                // 결과를 가져올 항목으로 추가
                transaction.getResult(UserKeys.pk(review.userId), UserKeys.sk(review.userId));
            }
        });

        await transaction.executeAndGet();

        // 베스트 리뷰로 등록한 경우 포인트 로그 기록
        if (isBest) {
            await Promise.all(
                reviews.map(review =>
                    logPointAction(3000, POINT_CHANGE_REASON.BEST_REVIEW.value, review.userId),
                ),
            );
        }
    });
}

/**
 * 템플릿별 리뷰 조회
 */
export async function getTemplateReviewsAction(
    templateId: string,
): Promise<ActionResponse<ReviewPublic[]>> {
    return withActionResponse(async () => {
        const reviews = await repository.queryGSI2<ReviewEntity>(
            TemplateKeys.pk(templateId),
            undefined,
            false,
        );
        return reviews.map(toReviewPublic);
    });
}
