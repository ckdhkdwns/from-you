import React from 'react';
import { getAllReviewsAction } from '@/models/actions/review-actions';
import ReviewProvider from './_contexts/review-context';
import ReviewDataTable from './_components/review-data-table';

export default async function ReviewPage() {
    const { data: reviews } = await getAllReviewsAction();

    console.log(reviews);
    return (
        <ReviewProvider initialReviews={reviews}>
            <ReviewDataTable />
        </ReviewProvider>
    );
}
