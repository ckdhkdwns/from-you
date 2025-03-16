'use client';

import {
    createPopupAction,
    deletePopupAction,
    getAllPopupsAction,
    updatePopupAction,
} from '@/models/actions/popup-actions';
import { PopupPublic } from '@/models/types/popup';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AdminPopupContextType {
    popups: PopupPublic[];
    isLoading: boolean;
    selectedPopup: PopupPublic | null;
    isDialogOpen: boolean;
    isCreateDialogOpen: boolean;
    setSelectedPopup: (_popup: PopupPublic | null) => void;
    setIsDialogOpen: (_open: boolean) => void;
    setIsCreateDialogOpen: (_open: boolean) => void;
    refreshPopups: () => Promise<void>;
    createPopup: (_formData: FormData) => Promise<boolean>;
    updatePopup: (_popupId: string, _formData: FormData) => Promise<boolean>;
    deletePopup: (_popupId: string) => Promise<boolean>;
}

export const AdminPopupContext = createContext<AdminPopupContextType>({
    popups: [],
    isLoading: false,
    selectedPopup: null,
    isDialogOpen: false,
    isCreateDialogOpen: false,
    setSelectedPopup: () => {},
    setIsDialogOpen: () => {},
    setIsCreateDialogOpen: () => {},
    refreshPopups: async () => {},
    createPopup: async () => false,
    updatePopup: async () => false,
    deletePopup: async () => false,
});

export const AdminPopupProvider = ({ children }: { children: React.ReactNode }) => {
    const [popups, setPopups] = useState<PopupPublic[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedPopup, setSelectedPopup] = useState<PopupPublic | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

    const refreshPopups = async () => {
        setIsLoading(true);
        try {
            const { success, data: fetchedPopups, error } = await getAllPopupsAction();

            if (success && fetchedPopups) {
                setPopups(fetchedPopups);
            } else {
                toast.error(error.message || '팝업 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('팝업 목록 조회 오류:', error);
            toast.error('팝업 목록을 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const createPopup = async (formData: FormData): Promise<boolean> => {
        try {
            const { success, error } = await createPopupAction(formData);

            if (success) {
                toast.success('팝업이 성공적으로 생성되었습니다.');
                await refreshPopups();
                return true;
            } else {
                toast.error(error.message || '팝업 생성에 실패했습니다.');
                return false;
            }
        } catch (error) {
            console.error('팝업 생성 오류:', error);
            toast.error('팝업 생성 중 오류가 발생했습니다.');
            return false;
        }
    };

    const updatePopup = async (popupId: string, formData: FormData): Promise<boolean> => {
        try {
            const { success, error } = await updatePopupAction(popupId, formData);

            if (success) {
                toast.success('팝업이 성공적으로 수정되었습니다.');
                await refreshPopups();
                return true;
            } else {
                toast.error(error.message || '팝업 수정에 실패했습니다.');
                return false;
            }
        } catch (error) {
            console.error('팝업 수정 오류:', error);
            toast.error('팝업 수정 중 오류가 발생했습니다.');
            return false;
        }
    };

    const deletePopup = async (popupId: string): Promise<boolean> => {
        try {
            const { success, error } = await deletePopupAction(popupId);

            if (success) {
                toast.success('팝업이 성공적으로 삭제되었습니다.');
                await refreshPopups();
                return true;
            } else {
                toast.error(error.message || '팝업 삭제에 실패했습니다.');
                return false;
            }
        } catch (error) {
            console.error('팝업 삭제 오류:', error);
            toast.error('팝업 삭제 중 오류가 발생했습니다.');
            return false;
        }
    };

    useEffect(() => {
        refreshPopups();
    }, []);

    return (
        <AdminPopupContext.Provider
            value={{
                popups,
                isLoading,
                selectedPopup,
                isDialogOpen,
                isCreateDialogOpen,
                setSelectedPopup,
                setIsDialogOpen,
                setIsCreateDialogOpen,
                refreshPopups,
                createPopup,
                updatePopup,
                deletePopup,
            }}
        >
            {children}
        </AdminPopupContext.Provider>
    );
};

export const useAdminPopup = () => {
    return useContext(AdminPopupContext);
};
