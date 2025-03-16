import React from 'react';
import ReviewItem from './review-item';
import { ReviewPublic } from '@/models/types/review';

type ReviewSectionProps = {
    thumbnail: string;
    reviews: ReviewPublic[];
};

const MAX_REVIEW_COUNT = 5;

export default function ReviewSection({ thumbnail, reviews }: ReviewSectionProps) {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">리뷰 {reviews.length}</h2>
                {reviews.length > MAX_REVIEW_COUNT && (
                    <button className="cursor-pointer flex items-center gap-1 font-normal text-gray-500 hover:underline">
                        <div>전체 보기</div>
                    </button>
                )}
            </div>
            <div className="flex flex-col gap-6">
                {reviews.slice(0, MAX_REVIEW_COUNT).map(review => (
                    <ReviewItem key={review.PK} review={review} thumbnail={thumbnail} />
                ))}
            </div>

            {reviews.length === 0 && (
                <p className="text-center text-gray-400 font-normal py-12">
                    아직 작성된 후기가 없습니다.
                </p>
            )}
        </div>
    );
}
