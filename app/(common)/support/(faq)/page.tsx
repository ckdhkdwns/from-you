'use client';

import React, { useEffect, useState } from 'react';
import RoundedTabs from '@/components/ui/rounded-tabs';
import { getFAQs } from '@/models/actions/faq-actions';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { FaqPublic } from '@/models/types/faq';
import { removeTableKeyPrefix } from '@/lib/api-utils';

export default function page() {
    const [faqs, setFaqs] = useState<FaqPublic[]>([]);
    const [activeTab, setActiveTab] = useState({
        label: '전체',
        value: '전체',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [search, _setSearch] = useState('');

    const tabs = [
        { label: '전체', value: '전체' },
        { label: '우편', value: '우편' },
        { label: '작성방법', value: '작성방법' },
        { label: '포인트', value: '포인트' },
    ];

    useEffect(() => {
        const fetchFaqs = async () => {
            const faqs = await getFAQs();
            if (faqs.success) {
                setFaqs(faqs.data);
            }
            setIsLoading(false);
        };
        fetchFaqs();
    }, [search]);

    const filteredFaqs =
        activeTab.value === '전체' ? faqs : faqs.filter(faq => faq.category === activeTab.value);

    const searchedFaqs = filteredFaqs.filter(faq =>
        faq.question.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="flex flex-col gap-4 pb-24">
            <div className="mt-2">
                <RoundedTabs tabs={tabs} activeTab={activeTab} onClick={tab => setActiveTab(tab)} />
            </div>

            <Accordion type="single" collapsible className="w-full">
                {searchedFaqs.map((faq, index) => {
                    return (
                        <AccordionItem value={removeTableKeyPrefix(faq?.SK)} key={index}>
                            <AccordionTrigger>
                                <div className="flex items-center gap-3">
                                    <div className="text-gray-400">Q</div>
                                    <div>
                                        [{faq.category}] {faq.question}
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="whitespace-pre-line">{faq.answer}</div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
                {searchedFaqs.length === 0 && (
                    <div className="text-center text-gray-400 mt-8">
                        {isLoading ? '불러오는 중...' : '결과가 없습니다'}
                    </div>
                )}
            </Accordion>
        </div>
    );
}
