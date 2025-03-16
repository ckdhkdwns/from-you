import LinearTabs from '@/components/ui/linear-tabs';
import React from 'react';

export default function AddressTypeTabs({ addressType }: { addressType: 'recipient' | 'sender' }) {
    const tabs = [
        {
            label: '발신 주소',
            value: 'sender',
            href: `/mypage/address/sender`,
        },
        {
            label: '수신 주소',
            value: 'recipient',
            href: `/mypage/address/recipient`,
        },
    ];

    const activeTab = tabs.find(tab => tab.value === addressType);
    return <LinearTabs tabs={tabs} activeTab={activeTab} />;
}
