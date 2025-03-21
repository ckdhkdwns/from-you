'use client';

import { removeTableKeyPrefix } from '@/lib/api-utils';
import { getAllPopupsAction } from '@/models/actions/popup-actions';
import { PopupPublic } from '@/models/types/popup';
import { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

interface PopupsProviderProps {
    children: React.ReactNode;
    initialPopups: PopupPublic[];
}

interface PopupsContextType {
    popups: PopupPublic[];
    isLoading: boolean;
    selectedPopups: string[];
    setSelectedPopups: (_popups: string[]) => void;
    addPopup: (_popup: PopupPublic) => void;
    updatePopupInList: (_id: string, _updatedPopup: PopupPublic) => void;
    removePopup: (_id: string) => void;
    removePopups: (_ids: string[]) => void;
    refreshPopups: () => Promise<void>;
}

const PopupsContext = createContext<PopupsContextType>({
    popups: [],
    isLoading: false,
    selectedPopups: [],
    setSelectedPopups: () => {},
    addPopup: () => {},
    updatePopupInList: () => {},
    removePopup: () => {},
    removePopups: () => {},
    refreshPopups: async () => {},
});

export function PopupsProvider({ children, initialPopups }: PopupsProviderProps) {
    const [popups, setPopups] = useState<PopupPublic[]>(initialPopups);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPopups, setSelectedPopups] = useState<string[]>([]);

    const refreshPopups = async () => {
        // 필요할 때 수동으로 새로고침하는 함수
        setIsLoading(true);

        try {
            const result = await getAllPopupsAction();
            if (result.success) {
                setPopups(result.data);
            } else {
                toast.error(result.error?.message || '팝업을 불러오는 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('팝업 로드 오류:', error);
            toast.error('팝업을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const addPopup = (popup: PopupPublic) => {
        setPopups(prev => [popup, ...prev]);
    };

    const updatePopupInList = (id: string, updatedPopup: PopupPublic) => {
        setPopups(prev =>
            prev.map(popup => (removeTableKeyPrefix(popup.PK) === id ? updatedPopup : popup)),
        );
    };

    const removePopup = (id: string) => {
        setPopups(prev => prev.filter(popup => removeTableKeyPrefix(popup.PK) !== id));
    };

    const removePopups = (ids: string[]) => {
        setPopups(prev => prev.filter(popup => !ids.includes(removeTableKeyPrefix(popup.PK))));
    };

    return (
        <PopupsContext.Provider
            value={{
                popups,
                isLoading,
                selectedPopups,
                setSelectedPopups,
                addPopup,
                updatePopupInList,
                removePopup,
                removePopups,
                refreshPopups,
            }}
        >
            {children}
        </PopupsContext.Provider>
    );
}

export const usePopups = () => {
    return useContext(PopupsContext);
};
