'use client';

import {
    createReceivedLetterAction,
    updateReceivedLetterAction,
    deleteReceivedLetterAction,
} from '@/models/actions/received-letter-action';
import { ReceivedLetterPublic, ReceivedLetterInput } from '@/models/types/received-letter';
import { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { getUserIdBySession } from '@/lib/auth';
import { removeTableKeyPrefix } from '@/lib/api-utils';

interface ReceivedLetterProviderProps {
    children: React.ReactNode;
    initialReceivedLetters: ReceivedLetterPublic[];
}

interface ReceivedLetterContextType {
    receivedLetters: ReceivedLetterPublic[];
    setReceivedLetters: (_receivedLetters: ReceivedLetterPublic[]) => void;
    handleCreateReceivedLetter: (_letter: ReceivedLetterInput) => Promise<void>;
    handleUpdateReceivedLetter: (_letter: ReceivedLetterInput) => Promise<void>;
    handleDeleteReceivedLetter: (_letterId: string) => Promise<void>;
    handleBulkDeleteReceivedLetters: (_letterIds: string[]) => Promise<void>;
}

const ReceivedLetterContext = createContext<ReceivedLetterContextType>({
    receivedLetters: [],
    setReceivedLetters: () => {},
    handleCreateReceivedLetter: async () => {},
    handleUpdateReceivedLetter: async () => {},
    handleDeleteReceivedLetter: async () => {},
    handleBulkDeleteReceivedLetters: async () => {},
});

export function ReceivedLetterProvider({
    children,
    initialReceivedLetters,
}: ReceivedLetterProviderProps) {
    const [receivedLetters, setReceivedLetters] =
        useState<ReceivedLetterPublic[]>(initialReceivedLetters);

    const handleCreateReceivedLetter = useCallback(async (letter: ReceivedLetterInput) => {
        try {
            const receivedLetter = await createReceivedLetterAction(letter, letter.photos);

            if (receivedLetter.success) {
                toast.success(`${letter.senderName}님에게 편지를 전달했습니다.`);
                setReceivedLetters(prevLetters => [receivedLetter.data, ...prevLetters]);
            }
        } catch (error) {
            console.error('편지 생성 오류:', error);
            toast.error('편지 전달 중 오류가 발생했습니다.');
        }
    }, []);

    const handleUpdateReceivedLetter = useCallback(async (letter: ReceivedLetterInput) => {
        try {
            const updatedLetter = await updateReceivedLetterAction(letter);

            if (updatedLetter.success) {
                toast.success(`${letter.senderName}님의 편지가 수정되었습니다.`);
                setReceivedLetters(prevLetters =>
                    prevLetters.map(l =>
                        removeTableKeyPrefix(l?.SK) === letter.id ? updatedLetter.data : l,
                    ),
                );
            }
        } catch (error) {
            console.error('편지 수정 오류:', error);
            toast.error('편지 수정 중 오류가 발생했습니다.');
        }
    }, []);

    const handleDeleteReceivedLetter = useCallback(async (letterId: string) => {
        try {
            const userId = await getUserIdBySession();
            const result = await deleteReceivedLetterAction({
                userId,
                letterId,
            });

            if (result.success) {
                toast.success('편지가 삭제되었습니다.');
                setReceivedLetters(prevLetters =>
                    prevLetters.filter(letter => removeTableKeyPrefix(letter?.SK) !== letterId),
                );
            }
        } catch (error) {
            console.error('편지 삭제 오류:', error);
            toast.error('편지 삭제 중 오류가 발생했습니다.');
        }
    }, []);

    const handleBulkDeleteReceivedLetters = useCallback(async (letterIds: string[]) => {
        try {
            if (letterIds.length === 0) {
                toast.error('선택된 편지가 없습니다.');
                return;
            }

            const userId = await getUserIdBySession();
            const result = await deleteReceivedLetterAction({
                userId,
                letterIds,
            });

            if (result.success) {
                const { successCount, failedIds } = result.data;

                if (failedIds.length === 0) {
                    toast.success(`${successCount}개의 편지가 삭제되었습니다.`);
                } else {
                    toast.success(
                        `${successCount}개의 편지가 삭제되었습니다. ${failedIds.length}개 삭제 실패.`,
                    );
                }

                setReceivedLetters(prevLetters =>
                    prevLetters.filter(
                        letter => !letterIds.includes(removeTableKeyPrefix(letter?.SK)),
                    ),
                );
            }
        } catch (error) {
            console.error('일괄 편지 삭제 오류:', error);
            toast.error('편지 일괄 삭제 중 오류가 발생했습니다.');
        }
    }, []);

    return (
        <ReceivedLetterContext.Provider
            value={{
                receivedLetters,
                setReceivedLetters,
                handleCreateReceivedLetter,
                handleUpdateReceivedLetter,
                handleDeleteReceivedLetter,
                handleBulkDeleteReceivedLetters,
            }}
        >
            {children}
        </ReceivedLetterContext.Provider>
    );
}

export const useReceivedLetter = () => {
    return useContext(ReceivedLetterContext);
};
