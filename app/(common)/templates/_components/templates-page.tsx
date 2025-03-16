'use client';

import React, { useState } from 'react';
import TemplateGrid from './template-grid';
import RoundedTabs from '@/components/ui/rounded-tabs';
import { TemplatePublic } from '@/models/types/template';

export default function TemplatesPage({
    templates: initialTemplates,
}: {
    templates: TemplatePublic[];
}) {
    // 카테고리 목록 생성
    const categories = Array.from(new Set(initialTemplates.map(template => template.category)));
    const tabs = [
        { label: '오늘의 편지지', value: 'today' },
        { label: '전체', value: 'all' },
        ...categories.map(category => ({
            label: category,
            value: category,
        })),
    ];

    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [filteredTemplates, setFilteredTemplates] = useState(initialTemplates);

    const handleTabChange = (tab: { label: string; value: string }) => {
        setActiveTab(tab);
        if (tab.value === 'all') {
            setFilteredTemplates(initialTemplates);
        } else if (tab.value === 'today') {
            setFilteredTemplates(initialTemplates.filter(template => template.isPopular));
        } else {
            // 카테고리별 필터링
            setFilteredTemplates(
                initialTemplates.filter(template => template.category === tab.value),
            );
        }
    };

    return (
        <div className="mt-8 flex flex-col items-center gap-8">
            <p className="text-2xl md:text-[1.75rem] font-bold text-left text-primary-black/90">
                {activeTab.label}
            </p>

            <div className="w-full flex justify-center my-6">
                <RoundedTabs tabs={tabs} activeTab={activeTab} onClick={handleTabChange} />
            </div>

            <div className="w-full">
                <TemplateGrid templates={filteredTemplates} />
            </div>
        </div>
    );
}
