import React from 'react';
import { getAllReviewsAction } from '@/models/actions/review-actions';
import ReviewProvider from './_contexts/review-provider';
import ReviewDataTable from './_components/review-data-table';

export default async function ReviewPage() {
    const { data: reviews } = await getAllReviewsAction();

    return (
        <ReviewProvider initialReviews={reviews}>
            <ReviewDataTable />
        </ReviewProvider>
    );
}
