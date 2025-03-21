'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
    getFAQs,
    deleteFAQs as apiDeleteFAQs,
    toggleFAQStatus,
    createFAQ as apiCreateFAQ,
    updateFAQ as apiUpdateFAQ,
} from '@/models/actions/faq-actions';
import { FaqPublic, FaqInput, FaqKeys } from '@/models/types/faq';
import { toast } from 'sonner';
import {
    apiHandler,
    withLoading,
    processBatchItems,
    ensureArray,
    ensureEntityKey,
} from '@/lib/api-utils';
import { TableKey } from '@/models/types/dynamo';

interface FAQsContextType {
    faqs: FaqPublic[];
    isActionLoading: boolean;
    selectedFAQs: FaqPublic[];
    setSelectedFAQs: (_faqs: FaqPublic[]) => void;
    createFAQ: (_faq: FaqInput) => Promise<FaqPublic | null>;
    updateFAQ: (_id: string, _updatedFAQ: FaqInput) => Promise<FaqPublic | null>;
    deleteFAQs: (_faqOrFAQs: FaqPublic | FaqPublic[]) => Promise<void>;
    toggleFAQsStatus: (
        _faqOrFAQs: FaqPublic | FaqPublic[],
        _isPublished: boolean,
    ) => Promise<void>;
    refreshFAQs: () => Promise<void>;
    isDialogOpen: boolean;
    setIsDialogOpen: (_open: boolean) => void;
    selectedFAQ: FaqPublic | undefined;
    setSelectedFAQ: (_faq: FaqPublic | undefined) => void;
    handleRowClick: (_row: FaqPublic) => void;
    handleDialogClose: () => void;
}

interface FAQsProviderProps {
    children: ReactNode;
    initialFAQs: FaqPublic[];
}

const FAQsContext = createContext<FAQsContextType>({
    faqs: [],
    isActionLoading: false,
    selectedFAQs: [],
    setSelectedFAQs: () => {},
    createFAQ: async () => null,
    updateFAQ: async () => null,
    deleteFAQs: async () => {},
    toggleFAQsStatus: async () => {},
    refreshFAQs: async () => {},
    isDialogOpen: false,
    setIsDialogOpen: () => {},
    selectedFAQ: undefined,
    setSelectedFAQ: () => {},
    handleRowClick: () => {},
    handleDialogClose: () => {},
});

export function FAQsProvider({ children, initialFAQs }: FAQsProviderProps) {
    const [faqs, setFAQs] = useState<FaqPublic[]>(initialFAQs);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [selectedFAQs, setSelectedFAQs] = useState<FaqPublic[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFAQ, setSelectedFAQ] = useState<FaqPublic | undefined>(undefined);

    const refreshFAQs = async () => {
        await apiHandler(getFAQs, data => setFAQs(data), {
            success: null,
            error: 'FAQ를 불러오는 중 오류가 발생했습니다.',
        });
    };

    const createFAQ = async (faqInput: FaqInput): Promise<FaqPublic | null> => {
        return apiHandler<FaqPublic>(
            () => apiCreateFAQ(faqInput),
            data => setFAQs(prev => [data, ...prev]),
            {
                success: 'FAQ가 생성되었습니다.',
                error: 'FAQ 생성 중 오류가 발생했습니다.',
            },
        );
    };

    const updateFAQ = async (
        id: string,
        faqInput: FaqInput,
    ): Promise<FaqPublic | null> => {
        return apiHandler(
            () => apiUpdateFAQ({ ...faqInput, id }),
            data => setFAQs(prev => prev.map(faq => (faq.SK === id ? data : faq))),
            {
                success: 'FAQ가 수정되었습니다.',
                error: 'FAQ 수정 중 오류가 발생했습니다.',
            },
        );
    };

    // 삭제 성공 시 상태 업데이트 함수
    const updateFAQsAfterDelete = (data: any, keys: TableKey[], isSingle: boolean) => {
        toast.success(
            isSingle
                ? 'FAQ가 삭제되었습니다.'
                : `${keys.length}개의 FAQ가 삭제되었습니다.`
        );

        setFAQs(prev =>
            prev.filter(faq => !keys.includes(ensureEntityKey(faq, FaqKeys)))
        );

        if (!isSingle) setSelectedFAQs([]);
        return data;
    };

    const deleteFAQs = async (faqOrFAQs: FaqPublic | FaqPublic[]) => {
        const batch = processBatchItems(faqOrFAQs, (keys) => {
            // TableKey[] 유형을 string[] 유형으로 변환
            const ids = keys.map(key => key.SK?.replace('FAQ#', '') || '');
            return apiDeleteFAQs(ids);
        });

        if (batch.keys.length === 0) return;

        const apiCall = () => batch.process();
        const onSuccess = (data: any) => updateFAQsAfterDelete(data, batch.keys, batch.isSingle);
        const messages = { success: null, error: 'FAQ 삭제 중 오류가 발생했습니다.' };

        const result = await withLoading(setIsActionLoading, () =>
            apiHandler(apiCall, onSuccess, messages)
        );

        if (result?.deletedIds && result.deletedIds.length < batch.keys.length) {
            await refreshFAQs();
        }
    };

    // 상태 변경 성공 시 상태 업데이트 함수
    const updateFAQsAfterStatusChange = (
        data: { updatedFaqs: FaqPublic[] },
        keys: TableKey[],
        isSingle: boolean,
        actionText: string
    ) => {
        toast.success(
            isSingle
                ? `FAQ가 ${actionText} 상태로 변경되었습니다.`
                : `${keys.length}개의 FAQ가 ${actionText} 상태로 변경되었습니다.`
        );

        if (data.updatedFaqs?.length) {
            const updatedMap = new Map(data.updatedFaqs.map(faq => [faq.SK, faq]));
            setFAQs(prev => prev.map(faq => updatedMap.get(faq.SK) || faq));
        }

        if (!isSingle) setSelectedFAQs([]);
        return data;
    };

    const toggleFAQsStatus = async (
        faqOrFAQs: FaqPublic | FaqPublic[],
        isPublished: boolean,
    ) => {
        const batch = processBatchItems(faqOrFAQs, (keys) => {
            // TableKey[] 유형을 string[] 유형으로 변환
            const ids = keys.map(key => key.SK?.replace('FAQ#', '') || '');
            return toggleFAQStatus(ids, isPublished);
        });

        if (batch.keys.length === 0) return;

        const actionText = isPublished ? '공개' : '비공개';

        const apiCall = () => batch.process();
        const onSuccess = (data: { updatedFaqs: FaqPublic[] }) =>
            updateFAQsAfterStatusChange(data, batch.keys, batch.isSingle, actionText);
        const messages = { success: null, error: 'FAQ 상태 변경 중 오류가 발생했습니다.' };

        const result = await withLoading(setIsActionLoading, () =>
            apiHandler(apiCall, onSuccess, messages)
        );

        if (result?.updatedFaqs && result.updatedFaqs.length < batch.keys.length) {
            await refreshFAQs();
        }
    };

    const handleRowClick = (row: FaqPublic) => {
        setSelectedFAQ(row);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        refreshFAQs();
    };

    return (
        <FAQsContext.Provider
            value={{
                faqs,
                isActionLoading,
                selectedFAQs,
                setSelectedFAQs,
                createFAQ,
                updateFAQ,
                deleteFAQs,
                toggleFAQsStatus,
                refreshFAQs,
                isDialogOpen,
                setIsDialogOpen,
                selectedFAQ,
                setSelectedFAQ,
                handleRowClick,
                handleDialogClose,
            }}
        >
            {children}
        </FAQsContext.Provider>
    );
}

export const useFAQs = () => {
    const context = useContext(FAQsContext);
    if (!context) {
        throw new Error('useFAQs must be used within a FAQsProvider');
    }
    return context;
};
