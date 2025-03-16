'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getNotices } from '@/models/actions/notice-actions';
import { NoticePublic } from '@/models/types/notice';
import { toast } from 'sonner';

interface NoticesContextType {
    notices: NoticePublic[];
    isLoading: boolean;
    selectedNotices: string[];
    setSelectedNotices: (_ids: string[]) => void;
    addNotice: (_notice: NoticePublic) => void;
    updateNoticeInList: (_id: string, _updatedNotice: NoticePublic) => void;
    removeNotice: (_id: string) => void;
    removeNotices: (_ids: string[]) => void;
    refreshNotices: () => Promise<void>;
}

interface NoticesProviderProps {
    children: ReactNode;
    initialNotices: NoticePublic[];
}

const NoticesContext = createContext<NoticesContextType>({
    notices: [],
    isLoading: false,
    selectedNotices: [],
    setSelectedNotices: () => {},
    addNotice: () => {},
    updateNoticeInList: () => {},
    removeNotice: () => {},
    removeNotices: () => {},
    refreshNotices: async () => {},
});

export function NoticesProvider({ children, initialNotices }: NoticesProviderProps) {
    const [notices, setNotices] = useState<NoticePublic[]>(initialNotices);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedNotices, setSelectedNotices] = useState<string[]>([]);

    // SK에서 공지사항 ID 추출
    const extractNoticeId = (sk: string): string => {
        return sk.replace('NOTICE#', '');
    };

    const refreshNotices = async () => {
        // 필요할 때 수동으로 새로고침하는 함수
        setIsLoading(true);

        try {
            const result = await getNotices();
            if (result.success) {
                setNotices(result.data);
            } else {
                toast.error(result.error?.message || '공지사항을 불러오는 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('공지사항 로드 오류:', error);
            toast.error('공지사항을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const addNotice = (notice: NoticePublic) => {
        setNotices(prev => [notice, ...prev]);
    };

    const updateNoticeInList = (id: string, updatedNotice: NoticePublic) => {
        setNotices(prev =>
            prev.map(notice => (extractNoticeId(notice?.SK) === id ? updatedNotice : notice)),
        );
    };

    const removeNotice = (id: string) => {
        setNotices(prev => prev.filter(notice => extractNoticeId(notice?.SK) !== id));
    };

    const removeNotices = (ids: string[]) => {
        setNotices(prev => prev.filter(notice => !ids.includes(extractNoticeId(notice?.SK))));
    };

    return (
        <NoticesContext.Provider
            value={{
                notices,
                isLoading,
                selectedNotices,
                setSelectedNotices,
                addNotice,
                updateNoticeInList,
                removeNotice,
                removeNotices,
                refreshNotices,
            }}
        >
            {children}
        </NoticesContext.Provider>
    );
}

export const useNotices = () => {
    const context = useContext(NoticesContext);
    if (!context) {
        throw new Error('useNotices must be used within a NoticesProvider');
    }
    return context;
};
