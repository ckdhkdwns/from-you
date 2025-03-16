import React from 'react';
import { ReviewProvider } from './_contexts/review-context';
import { getMyReviewsAction, getMyPreparedLettersAction } from '@/models/actions/review-actions';

export default async function layout({ children }: { children: React.ReactNode }) {
    const { data: initialReviews } = await getMyReviewsAction();
    const { data: initialPreparedLetters } = await getMyPreparedLettersAction();

    return (
        <div className="space-y-2 pt-12">
            <ReviewProvider
                initialReviews={initialReviews}
                initialPreparedLetters={initialPreparedLetters}
            >
                <div className="text-xl font-semibold mb-6">리뷰</div>

                {children}
            </ReviewProvider>
        </div>
    );
}
