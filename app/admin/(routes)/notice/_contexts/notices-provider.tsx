'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
    getNotices as apiGetNotices,
    deleteNotices as apiDeleteNotices,
    toggleNoticeStatus as apiToggleNoticeStatus,
    createNotice as apiCreateNotice,
    updateNotice as apiUpdateNotice,
} from '@/models/actions/notice-actions';
import { NoticePublic, NoticeInput, NoticeKeys } from '@/models/types/notice';
import { toast } from 'sonner';
import { apiHandler, withLoading, processBatchItems, ensureEntityKey } from '@/lib/api-utils';
import { TableKey } from '@/models/types/dynamo';

interface NoticesContextType {
    notices: NoticePublic[];
    isActionLoading: boolean;
    selectedNotices: NoticePublic[];
    setSelectedNotices: (_notices: NoticePublic[]) => void;
    createNotice: (_notice: NoticeInput) => Promise<NoticePublic | null>;
    updateNotice: (_id: string, _updatedNotice: NoticeInput) => Promise<NoticePublic | null>;
    deleteNotices: (_noticeOrNotices: NoticePublic | NoticePublic[]) => Promise<void>;
    toggleNoticesStatus: (
        _noticeOrNotices: NoticePublic | NoticePublic[],
        _isPublished: boolean,
    ) => Promise<void>;
    refreshNotices: () => Promise<void>;
    isDialogOpen: boolean;
    setIsDialogOpen: (_open: boolean) => void;
    selectedNotice: NoticePublic | undefined;
    setSelectedNotice: (_notice: NoticePublic | undefined) => void;
    handleRowClick: (_row: NoticePublic) => void;
    handleDialogClose: () => void;
}

interface NoticesProviderProps {
    children: ReactNode;
    initialNotices: NoticePublic[];
}

const NoticesContext = createContext<NoticesContextType>({
    notices: [],
    isActionLoading: false,
    selectedNotices: [],
    setSelectedNotices: () => {},
    createNotice: async () => null,
    updateNotice: async () => null,
    deleteNotices: async () => {},
    toggleNoticesStatus: async () => {},
    refreshNotices: async () => {},
    isDialogOpen: false,
    setIsDialogOpen: () => {},
    selectedNotice: undefined,
    setSelectedNotice: () => {},
    handleRowClick: () => {},
    handleDialogClose: () => {},
});

export function NoticesProvider({ children, initialNotices }: NoticesProviderProps) {
    const [notices, setNotices] = useState<NoticePublic[]>(initialNotices);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [selectedNotices, setSelectedNotices] = useState<NoticePublic[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState<NoticePublic | undefined>(undefined);

    const refreshNotices = async () => {
        await apiHandler(apiGetNotices, data => setNotices(data), {
            success: null,
            error: '공지사항을 불러오는 중 오류가 발생했습니다.',
        });
    };

    const createNotice = async (noticeInput: NoticeInput): Promise<NoticePublic | null> => {
        return apiHandler<NoticePublic>(
            () => apiCreateNotice(noticeInput),
            data => setNotices(prev => [data, ...prev]),
            {
                success: '공지사항이 생성되었습니다.',
                error: '공지사항 생성 중 오류가 발생했습니다.',
            },
        );
    };

    const updateNotice = async (
        id: string,
        noticeInput: NoticeInput,
    ): Promise<NoticePublic | null> => {
        return apiHandler(
            () => apiUpdateNotice({ ...noticeInput, id }),
            data => setNotices(prev => prev.map(notice => (notice.PK === id ? data : notice))),
            {
                success: '공지사항이 수정되었습니다.',
                error: '공지사항 수정 중 오류가 발생했습니다.',
            },
        );
    };

    // 삭제 성공 시 상태 업데이트 함수
    const updateNoticesAfterDelete = (data: any, keys: TableKey[], isSingle: boolean) => {
        toast.success(
            isSingle
                ? '공지사항이 삭제되었습니다.'
                : `${keys.length}개의 공지사항이 삭제되었습니다.`,
        );

        setNotices(prev =>
            prev.filter(notice => !keys.includes(ensureEntityKey(notice, NoticeKeys))),
        );

        if (!isSingle) setSelectedNotices([]);
        return data;
    };

    const deleteNotices = async (noticeOrNotices: NoticePublic | NoticePublic[]) => {
        const batch = processBatchItems(noticeOrNotices, apiDeleteNotices);
        if (batch.keys.length === 0) return;

        const apiCall = () => batch.process();
        const onSuccess = (data: any) => updateNoticesAfterDelete(data, batch.keys, batch.isSingle);
        const messages = { success: null, error: '공지사항 삭제 중 오류가 발생했습니다.' };

        const result = await withLoading(setIsActionLoading, () =>
            apiHandler(apiCall, onSuccess, messages),
        );

        if (result?.deletedIds && result.deletedIds.length < batch.keys.length) {
            await refreshNotices();
        }
    };

    // 상태 변경 성공 시 상태 업데이트 함수
    const updateNoticesAfterStatusChange = (
        data: { updatedNotices: NoticePublic[] },
        keys: TableKey[],
        isSingle: boolean,
        actionText: string,
    ) => {
        toast.success(
            isSingle
                ? `공지사항이 ${actionText} 상태로 변경되었습니다.`
                : `${keys.length}개의 공지사항이 ${actionText} 상태로 변경되었습니다.`,
        );

        if (data.updatedNotices?.length) {
            const updatedMap = new Map(data.updatedNotices.map(notice => [notice.PK, notice]));

            setNotices(prev => prev.map(notice => updatedMap.get(notice.PK) || notice));
        }

        if (!isSingle) setSelectedNotices([]);
        return data;
    };

    const toggleNoticesStatus = async (
        noticeOrNotices: NoticePublic | NoticePublic[],
        isPublished: boolean,
    ) => {
        const batch = processBatchItems(noticeOrNotices, keys =>
            apiToggleNoticeStatus(keys, isPublished),
        );

        if (batch.keys.length === 0) return;

        const actionText = isPublished ? '공개' : '비공개';

        const apiCall = () => batch.process();
        const onSuccess = (data: { updatedNotices: NoticePublic[] }) =>
            updateNoticesAfterStatusChange(data, batch.keys, batch.isSingle, actionText);
        const messages = { success: null, error: '공지사항 상태 변경 중 오류가 발생했습니다.' };

        const result = await withLoading(setIsActionLoading, () =>
            apiHandler(apiCall, onSuccess, messages),
        );

        if (result?.updatedNotices && result.updatedNotices.length < batch.keys.length) {
            await refreshNotices();
        }
    };

    const handleRowClick = (row: NoticePublic) => {
        setSelectedNotice(row);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        refreshNotices();
    };

    return (
        <NoticesContext.Provider
            value={{
                notices,
                isActionLoading,
                selectedNotices,
                setSelectedNotices,
                createNotice,
                updateNotice,
                deleteNotices,
                toggleNoticesStatus,
                refreshNotices,
                isDialogOpen,
                setIsDialogOpen,
                selectedNotice,
                setSelectedNotice,
                handleRowClick,
                handleDialogClose,
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
