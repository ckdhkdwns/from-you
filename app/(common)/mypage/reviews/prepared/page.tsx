import React from 'react';
import ReviewTabs from '../_components/review-tabs';
import PreparedPage from './prepared-page';

export default function Page() {
    return (
        <div className="space-y-12">
            <ReviewTabs reviewType="prepared" />
            <PreparedPage />
        </div>
    );
}
