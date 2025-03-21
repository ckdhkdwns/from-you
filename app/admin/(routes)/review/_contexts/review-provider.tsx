'use client';

import { createContext, useState, useContext } from 'react';
import {
    deleteMultipleReviewsAction,
    deleteReviewAction,
    toggleMultipleBestReviewsAction,
    getAllReviewsAction,
} from '@/models/actions/review-actions';
import { ReviewPublic } from '@/models/types/review';
import { removeTableKeyPrefix, apiHandler, withLoading } from '@/lib/api-utils';
import { toast } from 'sonner';

interface ReviewContextType {
    reviews: ReviewPublic[];
    isActionLoading: boolean;
    setReviews: (_reviews: ReviewPublic[]) => void;
    deleteReview: (_reviewId: string) => Promise<void>;
    deleteMultipleReviews: (_reviews: ReviewPublic[]) => Promise<void>;
    toggleBestReview: (_reviewId: string, _isBest: boolean) => Promise<void>;
    toggleMultipleBestReviews: (_reviews: ReviewPublic[], _isBest: boolean) => Promise<void>;
    refreshReviews: () => Promise<void>;
}

const ReviewContext = createContext<ReviewContextType>({
    reviews: [],
    isActionLoading: false,
    setReviews: () => {},
    deleteReview: async () => {},
    deleteMultipleReviews: async () => {},
    toggleBestReview: async () => {},
    toggleMultipleBestReviews: async () => {},
    refreshReviews: async () => {},
});

interface ReviewProviderProps {
    children: React.ReactNode;
    initialReviews: ReviewPublic[];
}

export default function ReviewProvider({ children, initialReviews }: ReviewProviderProps) {
    const [reviews, setReviews] = useState<ReviewPublic[]>(initialReviews);
    const [isActionLoading, setIsActionLoading] = useState(false);
    
    const refreshReviews = async () => {
        await apiHandler(getAllReviewsAction, data => setReviews(data), {
            success: null,
            error: '리뷰 목록을 불러오는 중 오류가 발생했습니다.',
        });
    };

    // 리뷰 삭제 후 상태 업데이트
    const updateAfterDelete = (reviewId: string) => {
        setReviews(prev => prev.filter(review => removeTableKeyPrefix(review?.SK) !== reviewId));
        return true;
    };

    // 여러 리뷰 삭제 후 상태 업데이트
    const updateAfterMultipleDelete = (selectedIds: string[]) => {
        setReviews(prev => prev.filter(review => !selectedIds.includes(removeTableKeyPrefix(review?.SK))));
        return true;
    };

    // 베스트 상태 토글 후 상태 업데이트
    const updateAfterToggleBest = (reviewId: string, isBest: boolean) => {
        setReviews(prev => prev.map(review =>
            removeTableKeyPrefix(review?.SK) === reviewId 
                ? { ...review, isBest } 
                : review
        ));
        return true;
    };

    // 여러 리뷰 베스트 상태 토글 후 상태 업데이트
    const updateAfterMultipleToggleBest = (selectedIds: string[], isBest: boolean) => {
        setReviews(prev => prev.map(review =>
            selectedIds.includes(removeTableKeyPrefix(review?.SK))
                ? { ...review, isBest }
                : review
        ));
        return true;
    };

    const deleteReview = async (reviewId: string) => {
        const review = reviews.find(review => removeTableKeyPrefix(review?.SK) === reviewId);
        if (!review) return;

        const userId = review.PK.replace('USER#', '');
        
        await withLoading(setIsActionLoading, async () => {
            return apiHandler(
                () => deleteReviewAction(userId, reviewId),
                () => {
                    updateAfterDelete(reviewId);
                    toast.success('리뷰가 삭제되었습니다.');
                },
                {
                    success: null,
                    error: '리뷰 삭제 중 오류가 발생했습니다.'
                }
            );
        });
    };

    const deleteMultipleReviews = async (selectedReviews: ReviewPublic[]) => {
        const reviewsToDelete = selectedReviews.map(review => ({
            userId: review.PK.replace('USER#', ''),
            reviewId: removeTableKeyPrefix(review?.SK),
        }));
        
        const selectedIds = selectedReviews.map(review => removeTableKeyPrefix(review?.SK));
        
        await withLoading(setIsActionLoading, async () => {
            return apiHandler(
                () => deleteMultipleReviewsAction(reviewsToDelete),
                () => {
                    updateAfterMultipleDelete(selectedIds);
                    toast.success(`${selectedIds.length}개의 리뷰가 삭제되었습니다.`);
                },
                {
                    success: null,
                    error: '리뷰 삭제 중 오류가 발생했습니다.'
                }
            );
        });
    };

    const toggleBestReview = async (reviewId: string, isBest: boolean) => {
        const review = reviews.find(review => removeTableKeyPrefix(review?.SK) === reviewId);
        if (!review) return;

        const userId = review.PK.replace('USER#', '');
        const toggleData = [{
            userId,
            reviewId,
            isBest,
        }];
        
        await withLoading(setIsActionLoading, async () => {
            return apiHandler(
                () => toggleMultipleBestReviewsAction(toggleData, isBest),
                () => {
                    updateAfterToggleBest(reviewId, isBest);
                    toast.success(isBest ? '베스트 리뷰로 등록되었습니다.' : '베스트 리뷰에서 해제되었습니다.');
                },
                {
                    success: null,
                    error: '베스트 리뷰 상태 변경 중 오류가 발생했습니다.'
                }
            );
        });
    };

    const toggleMultipleBestReviews = async (selectedReviews: ReviewPublic[], isBest: boolean) => {
        const reviewsToToggle = selectedReviews.map(review => ({
            userId: review.PK.replace('USER#', ''),
            reviewId: removeTableKeyPrefix(review?.SK),
            isBest,
        }));

        const selectedIds = selectedReviews.map(review => removeTableKeyPrefix(review?.SK));
        
        await withLoading(setIsActionLoading, async () => {
            return apiHandler(
                () => toggleMultipleBestReviewsAction(reviewsToToggle, isBest),
                () => {
                    updateAfterMultipleToggleBest(selectedIds, isBest);
                    toast.success(
                        isBest 
                            ? `${selectedIds.length}개의 리뷰가 베스트로 등록되었습니다.` 
                            : `${selectedIds.length}개의 리뷰가 베스트에서 해제되었습니다.`
                    );
                },
                {
                    success: null,
                    error: '베스트 리뷰 상태 변경 중 오류가 발생했습니다.'
                }
            );
        });
    };

    return (
        <ReviewContext.Provider
            value={{
                reviews,
                isActionLoading,
                setReviews,
                deleteReview,
                deleteMultipleReviews,
                toggleBestReview,
                toggleMultipleBestReviews,
                refreshReviews
            }}
        >
            {children}
        </ReviewContext.Provider>
    );
}

export const useAdminReview = () => {
    const context = useContext(ReviewContext);
    if (!context) {
        throw new Error('useAdminReview must be used within a ReviewProvider');
    }
    return context;
};
