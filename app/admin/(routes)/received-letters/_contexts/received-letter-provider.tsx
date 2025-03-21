'use client';

import {
    createReceivedLetterAction,
    updateReceivedLetterAction,
    deleteReceivedLetterAction,
    getReceivedLettersAction,
} from '@/models/actions/received-letter-action';
import { ReceivedLetterPublic, ReceivedLetterInput } from '@/models/types/received-letter';
import { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import { getUserIdBySession } from '@/lib/auth';
import { removeTableKeyPrefix, apiHandler, withLoading } from '@/lib/api-utils';

interface ReceivedLetterProviderProps {
    children: React.ReactNode;
    initialReceivedLetters: ReceivedLetterPublic[];
}

interface ReceivedLetterContextType {
    receivedLetters: ReceivedLetterPublic[];
    isActionLoading: boolean;
    setReceivedLetters: (_receivedLetters: ReceivedLetterPublic[]) => void;
    createReceivedLetter: (_letter: ReceivedLetterInput, _photos: any[]) => Promise<ReceivedLetterPublic | null>;
    updateReceivedLetter: (_letter: ReceivedLetterInput) => Promise<ReceivedLetterPublic | null>;
    deleteReceivedLetter: (_letterId: string) => Promise<void>;
    bulkDeleteReceivedLetters: (_letterIds: string[]) => Promise<void>;
    refreshReceivedLetters: () => Promise<void>;
}

const ReceivedLetterContext = createContext<ReceivedLetterContextType>({
    receivedLetters: [],
    isActionLoading: false,
    setReceivedLetters: () => {},
    createReceivedLetter: async () => null,
    updateReceivedLetter: async () => null,
    deleteReceivedLetter: async () => {},
    bulkDeleteReceivedLetters: async () => {},
    refreshReceivedLetters: async () => {},
});

export function ReceivedLetterProvider({
    children,
    initialReceivedLetters,
}: ReceivedLetterProviderProps) {
    const [receivedLetters, setReceivedLetters] = useState<ReceivedLetterPublic[]>(initialReceivedLetters);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const refreshReceivedLetters = async () => {
        await apiHandler(getReceivedLettersAction, data => setReceivedLetters(data), {
            success: null,
            error: '편지 목록을 불러오는 중 오류가 발생했습니다.',
        });
    };

    const createReceivedLetter = async (letter: ReceivedLetterInput, photos: any[]): Promise<ReceivedLetterPublic | null> => {
        return apiHandler<ReceivedLetterPublic>(
            () => createReceivedLetterAction(letter, photos),
            data => {
                setReceivedLetters(prev => [data, ...prev]);
                toast.success(`${letter.senderName}님에게 편지를 전달했습니다.`);
            },
            {
                success: null,
                error: '편지 전달 중 오류가 발생했습니다.',
            }
        );
    };

    const updateReceivedLetter = async (letter: ReceivedLetterInput): Promise<ReceivedLetterPublic | null> => {
        return apiHandler<ReceivedLetterPublic>(
            () => updateReceivedLetterAction(letter),
            data => {
                setReceivedLetters(prev => prev.map(l => 
                    removeTableKeyPrefix(l?.SK) === letter.id ? data : l
                ));
                toast.success(`${letter.senderName}님의 편지가 수정되었습니다.`);
            },
            {
                success: null,
                error: '편지 수정 중 오류가 발생했습니다.',
            }
        );
    };

    // 편지 삭제 성공 시 상태 업데이트 함수
    const updateAfterDelete = (data: any, letterId: string) => {
        setReceivedLetters(prev => 
            prev.filter(letter => removeTableKeyPrefix(letter?.SK) !== letterId)
        );
        toast.success('편지가 삭제되었습니다.');
        return data;
    };

    // 일괄 삭제 성공 시 상태 업데이트 함수
    const updateAfterBulkDelete = (data: any, letterIds: string[]) => {
        const { successCount, failedIds } = data;
        
        if (failedIds.length === 0) {
            toast.success(`${successCount}개의 편지가 삭제되었습니다.`);
        } else {
            toast.success(
                `${successCount}개의 편지가 삭제되었습니다. ${failedIds.length}개 삭제 실패.`
            );
        }
        
        setReceivedLetters(prev =>
            prev.filter(letter => !letterIds.includes(removeTableKeyPrefix(letter?.SK)))
        );
        
        return data;
    };

    const deleteReceivedLetter = async (letterId: string): Promise<void> => {
        await withLoading(setIsActionLoading, async () => {
            const userId = await getUserIdBySession();
            
            return apiHandler(
                () => deleteReceivedLetterAction({ userId, letterId }),
                data => updateAfterDelete(data, letterId),
                {
                    success: null,
                    error: '편지 삭제 중 오류가 발생했습니다.',
                }
            );
        });
    };

    const bulkDeleteReceivedLetters = async (letterIds: string[]): Promise<void> => {
        if (letterIds.length === 0) {
            toast.error('선택된 편지가 없습니다.');
            return;
        }

        await withLoading(setIsActionLoading, async () => {
            const userId = await getUserIdBySession();
            
            return apiHandler(
                () => deleteReceivedLetterAction({ userId, letterIds }),
                data => updateAfterBulkDelete(data, letterIds),
                {
                    success: null,
                    error: '편지 일괄 삭제 중 오류가 발생했습니다.',
                }
            );
        });
    };

    return (
        <ReceivedLetterContext.Provider
            value={{
                receivedLetters,
                isActionLoading,
                setReceivedLetters,
                createReceivedLetter,
                updateReceivedLetter,
                deleteReceivedLetter,
                bulkDeleteReceivedLetters,
                refreshReceivedLetters
            }}
        >
            {children}
        </ReceivedLetterContext.Provider>
    );
}

export const useReceivedLetter = () => {
    return useContext(ReceivedLetterContext);
};
