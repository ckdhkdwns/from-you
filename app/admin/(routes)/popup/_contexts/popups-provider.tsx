'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
    getAllPopupsAction,
    deletePopupAction as apiDeletePopup,
    createPopupAction as apiCreatePopup,
    updatePopupAction as apiUpdatePopup,
    deletePopups as apiDeletePopups,
} from '@/models/actions/popup-actions';
import { PopupPublic, PopupInput, PopupKeys } from '@/models/types/popup';
import { toast } from 'sonner';
import {
    apiHandler,
    withLoading,
    processBatchItems,
    ensureArray,
    ensureEntityKey,
    removeTableKeyPrefix,
} from '@/lib/api-utils';
import { TableKey } from '@/models/types/dynamo';

interface PopupsContextType {
    popups: PopupPublic[];
    isActionLoading: boolean;
    selectedPopups: PopupPublic[];
    setSelectedPopups: (_popups: PopupPublic[]) => void;
    createPopup: (_popup: FormData) => Promise<PopupPublic | null>;
    updatePopup: (_id: string, _updatedPopup: FormData) => Promise<PopupPublic | null>;
    deletePopups: (_popupOrPopups: PopupPublic | PopupPublic[]) => Promise<void>;
    refreshPopups: () => Promise<void>;
    isDialogOpen: boolean;
    setIsDialogOpen: (_open: boolean) => void;
    selectedPopup: PopupPublic | undefined;
    setSelectedPopup: (_popup: PopupPublic | undefined) => void;
    handleRowClick: (_row: PopupPublic) => void;
    handleDialogClose: () => void;
}

interface PopupsProviderProps {
    children: ReactNode;
    initialPopups: PopupPublic[];
}

const PopupsContext = createContext<PopupsContextType>({
    popups: [],
    isActionLoading: false,
    selectedPopups: [],
    setSelectedPopups: () => {},
    createPopup: async () => null,
    updatePopup: async () => null,
    deletePopups: async () => {},
    refreshPopups: async () => {},
    isDialogOpen: false,
    setIsDialogOpen: () => {},
    selectedPopup: undefined,
    setSelectedPopup: () => {},
    handleRowClick: () => {},
    handleDialogClose: () => {},
});

export function PopupsProvider({ children, initialPopups }: PopupsProviderProps) {
    const [popups, setPopups] = useState<PopupPublic[]>(initialPopups);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [selectedPopups, setSelectedPopups] = useState<PopupPublic[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPopup, setSelectedPopup] = useState<PopupPublic | undefined>(undefined);

    const refreshPopups = async () => {
        await apiHandler(getAllPopupsAction, data => setPopups(data), {
            success: null,
            error: '팝업을 불러오는 중 오류가 발생했습니다.',
        });
    };

    const createPopup = async (popupData: FormData): Promise<PopupPublic | null> => {
        return apiHandler<PopupPublic>(
            () => apiCreatePopup(popupData),
            data => setPopups(prev => [data, ...prev]),
            {
                success: '팝업이 생성되었습니다.',
                error: '팝업 생성 중 오류가 발생했습니다.',
            },
        );
    };

    const updatePopup = async (
        id: string,
        popupData: FormData,
    ): Promise<PopupPublic | null> => {
        return apiHandler(
            () => apiUpdatePopup(id, popupData),
            data => setPopups(prev => prev.map(popup => (removeTableKeyPrefix(popup.PK) === id ? data : popup))),
            {
                success: '팝업이 수정되었습니다.',
                error: '팝업 수정 중 오류가 발생했습니다.',
            },
        );
    };

    // 삭제 성공 시 상태 업데이트 함수
    const updatePopupsAfterDelete = (data: any, keys: TableKey[], isSingle: boolean) => {
        toast.success(
            isSingle
                ? '팝업이 삭제되었습니다.'
                : `${keys.length}개의 팝업이 삭제되었습니다.`
        );

        setPopups(prev =>
            prev.filter(popup => !keys.includes(ensureEntityKey(popup, PopupKeys)))
        );

        if (!isSingle) setSelectedPopups([]);
        return data;
    };

    const deletePopups = async (popupOrPopups: PopupPublic | PopupPublic[]) => {
        const batch = processBatchItems(popupOrPopups, apiDeletePopups);

        if (batch.keys.length === 0) return;

        const apiCall = () => batch.process();
        const onSuccess = (data: any) => updatePopupsAfterDelete(data, batch.keys, batch.isSingle);
        const messages = { success: null, error: '팝업 삭제 중 오류가 발생했습니다.' };

        const result = await withLoading(setIsActionLoading, () =>
            apiHandler(apiCall, onSuccess, messages)
        );

        // 항상 새로고침
        await refreshPopups();

        return result;
    };

    const handleRowClick = (row: PopupPublic) => {
        setSelectedPopup(row);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        refreshPopups();
    };

    return (
        <PopupsContext.Provider
            value={{
                popups,
                isActionLoading,
                selectedPopups,
                setSelectedPopups,
                createPopup,
                updatePopup,
                deletePopups,
                refreshPopups,
                isDialogOpen,
                setIsDialogOpen,
                selectedPopup,
                setSelectedPopup,
                handleRowClick,
                handleDialogClose,
            }}
        >
            {children}
        </PopupsContext.Provider>
    );
}

export const usePopups = () => {
    const context = useContext(PopupsContext);
    if (!context) {
        throw new Error('usePopups must be used within a PopupsProvider');
    }
    return context;
};
