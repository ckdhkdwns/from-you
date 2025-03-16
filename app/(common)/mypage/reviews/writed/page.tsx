import React from 'react';
import ReviewTabs from '../_components/review-tabs';
import ReviewList from '../_components/review-list';

export default function page() {
    return (
        <div className="space-y-12">
            <ReviewTabs reviewType="writed" />
            <ReviewList />
        </div>
    );
}
