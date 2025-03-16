'use client';

import React from 'react';

export default function RoundedTabs({
    tabs,
    activeTab,
    onClick,
}: {
    tabs: { label: string; value: string; href?: string }[];
    activeTab: { label: string; value: string };
    onClick: (_tab: { label: string; value: string }) => void;
}) {
    return (
        <div className="flex gap-2 flex-wrap">
            {tabs.map(tab => (
                <div
                    key={tab.value}
                    className={`flex justify-center items-center relative px-5 py-1 rounded-full text-sm cursor-pointer ${
                        activeTab.value === tab.value
                            ? 'text-gray-500 border-[1.5px] border-primary-pink font-semibold'
                            : 'text-gray-400 border-[1px] border-gray-300 font-normal'
                    }`}
                    onClick={() => onClick(tab)}
                >
                    {tab.label}
                </div>
            ))}
        </div>
    );
}
