'use client';

import { createContext, useState, useContext } from 'react';
import {
    deleteMultipleReviewsAction,
    deleteReviewAction,
    toggleMultipleBestReviewsAction,
} from '@/models/actions/review-actions';
import { ReviewPublic } from '@/models/types/review';
import { removeTableKeyPrefix } from '@/lib/api-utils';

interface ReviewContextType {
    reviews: ReviewPublic[];
    setReviews: (_reviews: ReviewPublic[]) => void;
    deleteReview: (_reviewId: string) => Promise<void>;
    deleteMultipleReviews: (_reviews: ReviewPublic[]) => Promise<void>;
    toggleBestReview: (_reviewId: string, _isBest: boolean) => Promise<void>;
    toggleMultipleBestReviews: (_reviews: ReviewPublic[], _isBest: boolean) => Promise<void>;
}

const ReviewContext = createContext<ReviewContextType>({
    reviews: [],
    setReviews: () => {},
    deleteReview: async () => {},
    deleteMultipleReviews: async () => {},
    toggleBestReview: async () => {},
    toggleMultipleBestReviews: async () => {},
});

interface ReviewProviderProps {
    children: React.ReactNode;
    initialReviews: ReviewPublic[];
}

export default function ReviewProvider({ children, initialReviews }: ReviewProviderProps) {
    const [reviews, setReviews] = useState<ReviewPublic[]>(initialReviews);

    const deleteReview = async (reviewId: string) => {
        const review = reviews.find(review => removeTableKeyPrefix(review?.SK) === reviewId);
        if (!review) return;

        const userId = review.PK.replace('USER#', '');
        const { success } = await deleteReviewAction(userId, reviewId);

        if (success) {
            setReviews(reviews.filter(review => removeTableKeyPrefix(review?.SK) !== reviewId));
        }
    };

    const deleteMultipleReviews = async (selectedReviews: ReviewPublic[]) => {
        const reviewsToDelete = selectedReviews.map(review => ({
            userId: review.PK.replace('USER#', ''),
            reviewId: removeTableKeyPrefix(review?.SK),
        }));

        const { success } = await deleteMultipleReviewsAction(reviewsToDelete);

        if (success) {
            const selectedIds = selectedReviews.map(review => removeTableKeyPrefix(review?.SK));
            setReviews(
                reviews.filter(review => !selectedIds.includes(removeTableKeyPrefix(review?.SK))),
            );
        }
    };

    const toggleBestReview = async (reviewId: string, isBest: boolean) => {
        const review = reviews.find(review => removeTableKeyPrefix(review?.SK) === reviewId);
        if (!review) return;

        const userId = review.PK.replace('USER#', '');
        const { success } = await toggleMultipleBestReviewsAction(
            [
                {
                    userId,
                    reviewId,
                    isBest,
                },
            ],
            isBest,
        );

        if (success) {
            setReviews(
                reviews.map(review =>
                    removeTableKeyPrefix(review?.SK) === reviewId ? { ...review, isBest } : review,
                ),
            );
        }
    };

    const toggleMultipleBestReviews = async (selectedReviews: ReviewPublic[], isBest: boolean) => {
        const reviewsToToggle = selectedReviews.map(review => ({
            userId: review.PK.replace('USER#', ''),
            reviewId: removeTableKeyPrefix(review?.SK),
            isBest,
        }));

        const { success } = await toggleMultipleBestReviewsAction(reviewsToToggle, isBest);

        if (success) {
            const selectedIds = selectedReviews.map(review => removeTableKeyPrefix(review?.SK));
            setReviews(
                reviews.map(review =>
                    selectedIds.includes(removeTableKeyPrefix(review?.SK))
                        ? { ...review, isBest }
                        : review,
                ),
            );
        }
    };

    return (
        <ReviewContext.Provider
            value={{
                reviews,
                setReviews,
                deleteReview,
                deleteMultipleReviews,
                toggleBestReview,
                toggleMultipleBestReviews,
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
