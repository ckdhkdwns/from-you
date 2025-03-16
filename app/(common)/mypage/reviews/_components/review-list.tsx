'use client';

import React from 'react';
import { useReview } from '../_contexts/review-context';
import ReviewItem from '@/app/(common)/templates/[id]/_components/review-item';

export default function ReviewList() {
    const { reviews } = useReview();
    return (
        <div>
            {reviews.length === 0 ? (
                <div className="text-center text-gray-400 py-8">작성한 리뷰가 없습니다.</div>
            ) : (
                reviews.map((review, index) => (
                    <ReviewItem
                        key={index}
                        review={review}
                        thumbnail={review.template?.thumbnail}
                    />
                ))
            )}
        </div>
    );
}
