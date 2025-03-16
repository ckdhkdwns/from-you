import LinearTabs from '@/components/ui/linear-tabs';
import React from 'react';

export default function ReviewTabs({ reviewType }: { reviewType: 'prepared' | 'writed' }) {
    const tabs = [
        {
            label: '작성 가능 후기',
            value: 'prepared',
            href: `/mypage/reviews/prepared`,
        },
        {
            label: '내가 작성한 후기',
            value: 'writed',
            href: `/mypage/reviews/writed`,
        },
    ];

    const activeTab = tabs.find(tab => tab.value === reviewType);
    return <LinearTabs tabs={tabs} activeTab={activeTab} />;
}
