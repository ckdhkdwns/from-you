'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getFAQs, deleteFAQs, toggleFAQStatus } from '@/models/actions/faq-actions';
import { FaqPublic } from '@/models/types/faq';
import { toast } from 'sonner';
import { removeTableKeyPrefix } from '@/lib/api-utils';

interface FAQsContextType {
    faqs: FaqPublic[];
    isLoading: boolean;
    selectedFAQs: string[];
    setSelectedFAQs: (_ids: string[]) => void;
    addFAQ: (_faq: FaqPublic) => void;
    updateFAQInList: (_id: string, _updatedFAQ: FaqPublic) => void;
    removeFAQ: (_id: string) => void;
    removeFAQs: (_ids: string[]) => void;
    refreshFAQs: () => Promise<void>;
    // 다이얼로그 관련 상태 및 함수
    isDialogOpen: boolean;
    setIsDialogOpen: (_open: boolean) => void;
    selectedFAQ: FaqPublic | undefined;
    setSelectedFAQ: (_faq: FaqPublic | undefined) => void;
    // 상태 변경 함수
    handleDeleteFAQs: (_ids: string[]) => Promise<boolean>;
    handleToggleFAQStatus: (_ids: string[], _isPublished: boolean) => Promise<boolean>;
}

interface FAQsProviderProps {
    children: ReactNode;
    initialFAQs: FaqPublic[];
}

const FAQsContext = createContext<FAQsContextType>({
    faqs: [],
    isLoading: false,
    selectedFAQs: [],
    setSelectedFAQs: () => {},
    addFAQ: () => {},
    updateFAQInList: () => {},
    removeFAQ: () => {},
    removeFAQs: () => {},
    refreshFAQs: async () => {},
    // 다이얼로그 관련 상태 및 함수
    isDialogOpen: false,
    setIsDialogOpen: () => {},
    selectedFAQ: undefined,
    setSelectedFAQ: () => {},
    // 상태 변경 함수
    handleDeleteFAQs: async () => false,
    handleToggleFAQStatus: async () => false,
});

export function FAQsProvider({ children, initialFAQs }: FAQsProviderProps) {
    const [faqs, setFAQs] = useState<FaqPublic[]>(initialFAQs);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFAQs, setSelectedFAQs] = useState<string[]>([]);
    // 다이얼로그 관련 상태
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFAQ, setSelectedFAQ] = useState<FaqPublic | undefined>(undefined);

    const refreshFAQs = async () => {
        setIsLoading(true);

        try {
            const result = await getFAQs();
            if (result.success) {
                setFAQs(result.data);
            } else {
                toast.error(result.error?.message || 'FAQ를 불러오는 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('FAQ 로드 오류:', error);
            toast.error('FAQ를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const addFAQ = (faq: FaqPublic) => {
        setFAQs(prev => [faq, ...prev]);
    };

    const updateFAQInList = (id: string, updatedFAQ: FaqPublic) => {
        setFAQs(prev => prev.map(faq => (removeTableKeyPrefix(faq?.SK) === id ? updatedFAQ : faq)));
    };

    const removeFAQ = (id: string) => {
        setFAQs(prev => prev.filter(faq => removeTableKeyPrefix(faq?.SK) !== id));
    };

    const removeFAQs = (ids: string[]) => {
        setFAQs(prev => prev.filter(faq => !ids.includes(removeTableKeyPrefix(faq?.SK))));
    };

    // FAQ 삭제 핸들러
    const handleDeleteFAQs = async (ids: string[]): Promise<boolean> => {
        if (ids.length === 0) return false;

        setIsLoading(true);
        try {
            const response = await deleteFAQs(ids);
            if (response.success) {
                toast.success('FAQ가 성공적으로 삭제되었습니다.');
                removeFAQs(ids);
                return true;
            } else {
                toast.error(response.error?.message || 'FAQ 삭제 중 오류가 발생했습니다.');
                return false;
            }
        } catch (error) {
            console.error('FAQ 삭제 오류:', error);
            toast.error('FAQ 삭제 중 오류가 발생했습니다.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // FAQ 상태 변경 핸들러
    const handleToggleFAQStatus = async (ids: string[], isPublished: boolean): Promise<boolean> => {
        if (ids.length === 0) return false;

        setIsLoading(true);
        try {
            const response = await toggleFAQStatus(ids, isPublished);
            if (response.success) {
                toast.success(`FAQ ${isPublished ? '게시' : '숨김'} 처리되었습니다.`);
                const updatedFaqs = response.data.updatedFaqs;

                // 상태가 업데이트된 FAQ들을 로컬 상태에 반영
                updatedFaqs.forEach(faq => {
                    const id = removeTableKeyPrefix(faq?.SK);
                    updateFAQInList(id, faq);
                });

                return true;
            } else {
                toast.error(
                    response.error?.message ||
                        `FAQ ${isPublished ? '게시' : '숨김'} 처리 중 오류가 발생했습니다.`,
                );
                return false;
            }
        } catch (error) {
            console.error('FAQ 상태 변경 오류:', error);
            toast.error(`FAQ ${isPublished ? '게시' : '숨김'} 처리 중 오류가 발생했습니다.`);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FAQsContext.Provider
            value={{
                faqs,
                isLoading,
                selectedFAQs,
                setSelectedFAQs,
                addFAQ,
                updateFAQInList,
                removeFAQ,
                removeFAQs,
                refreshFAQs,
                // 다이얼로그 관련 상태 및 함수
                isDialogOpen,
                setIsDialogOpen,
                selectedFAQ,
                setSelectedFAQ,
                // 상태 변경 함수
                handleDeleteFAQs,
                handleToggleFAQStatus,
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
