'use client';

import React, { createContext, Dispatch, SetStateAction, useState } from 'react';

const SUPPORT_TABS = [
    { label: '자주묻는질문', value: 'faq' },
    { label: '공지사항', value: 'notice' },
] as const;

const supportTabsContext = createContext<{
    tabs: typeof SUPPORT_TABS;
    currentTab: string;
    setCurrentTab: Dispatch<SetStateAction<string>>;
}>({
    tabs: SUPPORT_TABS,
    currentTab: 'notice',
    setCurrentTab: () => {},
});

export default function SupportTabsProvider({ children }: { children: React.ReactNode }) {
    const [currentTab, setCurrentTab] = useState<(typeof SUPPORT_TABS)[number]['value']>(
        SUPPORT_TABS[0].value,
    );

    return (
        <supportTabsContext.Provider value={{ tabs: SUPPORT_TABS, currentTab, setCurrentTab }}>
            {children}
        </supportTabsContext.Provider>
    );
}
