'use client';

import React, { useEffect, useState } from 'react';
import LinearTabs from '@/components/ui/linear-tabs';
import { usePathname } from 'next/navigation';

export default function SupportTabs() {
    const tabs = [
        { label: '자주묻는질문', value: 'faq', href: '/support' },
        { label: '공지사항', value: 'notice', href: '/support/notice' },
        // { label: "이벤트", value: "event", href: "/support/event" },
    ];
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const pathname = usePathname();

    useEffect(() => {
        const tab = tabs.find(tab => tab.href === pathname);
        if (tab) {
            setActiveTab(tab);
        }
    }, [pathname]);

    return <LinearTabs tabs={tabs} activeTab={activeTab} />;
}
