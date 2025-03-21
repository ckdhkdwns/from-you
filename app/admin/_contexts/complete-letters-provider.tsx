'use client';

import {
    getCompleteLettersAction,
    deleteMultipleLettersAction,
} from '@/models/actions/letter-actions';
import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { useInterval } from '@/hooks/use-interval';
import { toast } from 'sonner';
import { LetterPublic } from '@/models/types/letter';
import { removeTableKeyPrefix } from '@/lib/api-utils';

const STORAGE_KEY = 'fromyou:admin:new-letters';

interface StoredLetterInfo {
    ids: string[];
    count: number;
    lastChecked: string;
}

// Base64 인코딩/디코딩을 사용한 로컬 스토리지 유틸리티 함수
const saveToLocalStorage = (ids: string[], count: number) => {
    if (typeof window !== 'undefined') {
        const info: StoredLetterInfo = {
            ids,
            count,
            lastChecked: new Date().toISOString(),
        };

        // JSON 문자열로 변환 후 Base64로 인코딩
        const jsonString = JSON.stringify(info);
        const encodedData = btoa(encodeURIComponent(jsonString));

        localStorage.setItem(STORAGE_KEY, encodedData);
    }
};

const loadFromLocalStorage = (): StoredLetterInfo | null => {
    if (typeof window !== 'undefined') {
        const encodedData = localStorage.getItem(STORAGE_KEY);

        if (!encodedData) return null;

        try {
            // Base64 디코딩 후 JSON 파싱
            const jsonString = decodeURIComponent(atob(encodedData));
            return JSON.parse(jsonString) as StoredLetterInfo;
        } catch (e) {
            console.error('로컬 스토리지 데이터 파싱 오류:', e);
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
    }
    return null;
};

const CompleteLettersContext = createContext<{
    letters: LetterPublic[] | null;
    selectedLetter: LetterPublic | null;
    isDialogOpen: boolean;
    setSelectedLetter: (_letter: LetterPublic) => void;
    setIsDialogOpen: (_open: boolean) => void;
    isLoading: boolean;
    hasNewLetters: boolean;
    newLettersCount: number;
    setHasNewLetters: (_hasNew: boolean) => void;
    resetNewLettersNotification: () => void;
    handleUpdateLetter: (_letterId: string, _attrs: Partial<LetterPublic>) => void;
    handleUpdateMultipleLetters: (_letterIds: string[], _attrs: Partial<LetterPublic>) => void;
    deleteSelectedLetters: (_selectedLetterIds: string[]) => Promise<{
        success: boolean;
        error?: string;
        message?: string;
    }>;
}>({
    letters: null,
    selectedLetter: null,
    isDialogOpen: false,
    setSelectedLetter: () => {},
    setIsDialogOpen: () => {},
    isLoading: true,
    hasNewLetters: false,
    newLettersCount: 0,
    setHasNewLetters: () => {},
    resetNewLettersNotification: () => {},
    handleUpdateLetter: () => {},
    handleUpdateMultipleLetters: () => {},
    deleteSelectedLetters: async () => ({ success: false }),
});

export default function CompleteLettersProvider({
    children,
    initialLetters = [],
}: {
    children: React.ReactNode;
    initialLetters?: LetterPublic[];
}) {
    const [letters, setLetters] = useState<LetterPublic[] | null>(initialLetters);
    const [selectedLetter, setSelectedLetter] = useState<LetterPublic | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(initialLetters.length === 0);
    const [hasNewLetters, setHasNewLetters] = useState(false);
    const [newLettersCount, setNewLettersCount] = useState(0);

    // 마지막으로 확인한 편지 ID 목록을 저장하는 ref
    const lastLetterIdsRef = useRef<string[]>([]);

    // 초기 데이터 설정
    useEffect(() => {
        if (initialLetters && initialLetters.length > 0) {
            setLetters(initialLetters);
            setIsLoading(false);

            // 새 편지 확인 로직도 실행
            checkForNewLetters(initialLetters);
        }
    }, [initialLetters]);

    // 로컬 스토리지에서 새 편지 정보 로드
    useEffect(() => {
        const storedInfo = loadFromLocalStorage();
        if (storedInfo) {
            lastLetterIdsRef.current = storedInfo.ids;
            setHasNewLetters(storedInfo.count > 0);
            setNewLettersCount(storedInfo.count);
        }
    }, []);

    // 알림 초기화 함수
    const resetNewLettersNotification = useCallback(() => {
        setHasNewLetters(false);
        setNewLettersCount(0);
        // 로컬 스토리지에도 초기화된 상태 저장
        if (lastLetterIdsRef.current.length > 0) {
            saveToLocalStorage(lastLetterIdsRef.current, 0);
        }
    }, []);

    // 새 편지가 있는지 확인하는 함수
    const checkForNewLetters = (newLetters: LetterPublic[] | null) => {
        if (!newLetters) return { hasNew: false, count: 0 };

        // 첫 로딩 시에는 새 편지 알림을 표시하지 않음
        if (lastLetterIdsRef.current.length === 0) {
            lastLetterIdsRef.current = newLetters.map(letter => removeTableKeyPrefix(letter?.SK));
            saveToLocalStorage(lastLetterIdsRef.current, 0);
            return { hasNew: false, count: 0 };
        }

        // 새로운 ID 찾기
        const newLetterIds = newLetters.map(letter => removeTableKeyPrefix(letter?.SK));
        const newIds = newLetterIds.filter(id => !lastLetterIdsRef.current.includes(id));
        const hasNew = newIds.length > 0;

        // 마지막 ID 목록 업데이트 (새 편지 알림은 유지)
        lastLetterIdsRef.current = newLetterIds;

        // return { hasNew: true, count: 2 };
        return { hasNew, count: newIds.length };
    };

    const fetchData = useCallback(async () => {
        console.log('새로운 편지 확인 중');
        const { success, data } = await getCompleteLettersAction();
        if (success && data) {
            // 새 편지가 있는지 확인
            const { hasNew, count } = checkForNewLetters(data);

            if (hasNew) {
                const updatedCount = newLettersCount + count;
                setHasNewLetters(true);
                setNewLettersCount(updatedCount);
                saveToLocalStorage(lastLetterIdsRef.current, updatedCount);

                // 새 편지가 있을 때 toast 알림 표시
                toast(`새로운 편지 ${count}개가 도착했습니다.`, {
                    duration: 5000,
                    action: {
                        label: '확인하기',
                        onClick: () => {
                            window.location.href = '/admin/letters';
                        },
                    },
                    classNames: {
                        actionButton: '!bg-secondary-newpink text-white',
                    },
                });
            }

            setLetters(data);
        }
        setIsLoading(false);
    }, [newLettersCount]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useInterval(fetchData, 10000);

    const handleUpdateLetter = (letterId: string, attrs: Partial<LetterPublic>) => {
        const updatedLetters = letters?.map(letter =>
            removeTableKeyPrefix(letter?.SK) === letterId ? { ...letter, ...attrs } : letter,
        );
        setLetters(updatedLetters);
    };

    // 여러 편지를 한번에 업데이트하는 함수
    const handleUpdateMultipleLetters = (letterIds: string[], attrs: Partial<LetterPublic>) => {
        const updatedLetters = letters?.map(letter =>
            letterIds.includes(removeTableKeyPrefix(letter?.SK)) ? { ...letter, ...attrs } : letter,
        );
        setLetters(updatedLetters);
    };

    // 선택된 편지들을 삭제하는 함수
    const deleteSelectedLetters = async (selectedLetterIds: string[]) => {
        if (!selectedLetterIds.length) {
            return {
                success: false,
                error: '선택된 편지가 없습니다.',
            };
        }

        try {
            const result = await deleteMultipleLettersAction(selectedLetterIds);

            if (result.success) {
                // 삭제 성공 시 로컬 상태 업데이트
                const updatedLetters =
                    letters?.filter(
                        letter => !selectedLetterIds.includes(removeTableKeyPrefix(letter?.SK)),
                    ) || null;
                setLetters(updatedLetters);

                // 선택된 편지가 현재 상세 보기 중인 편지인 경우 다이얼로그 닫기
                if (
                    selectedLetter &&
                    selectedLetterIds.includes(removeTableKeyPrefix(selectedLetter?.SK))
                ) {
                    setIsDialogOpen(false);
                    setSelectedLetter(null);
                }

                return {
                    success: true,
                    message: `${selectedLetterIds.length}개의 편지가 삭제되었습니다.`,
                };
            } else {
                return {
                    success: false,
                    error: result.error
                        ? typeof result.error === 'string'
                            ? result.error
                            : result.error.message
                        : '편지 삭제 중 오류가 발생했습니다.',
                };
            }
        } catch (error) {
            console.error('편지 삭제 중 오류 발생:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : '편지 삭제 중 오류가 발생했습니다.',
            };
        }
    };

    return (
        <CompleteLettersContext.Provider
            value={{
                letters,
                selectedLetter,
                isDialogOpen,
                setSelectedLetter,
                setIsDialogOpen,
                isLoading,
                hasNewLetters,
                newLettersCount,
                setHasNewLetters,
                resetNewLettersNotification,
                handleUpdateLetter,
                handleUpdateMultipleLetters,
                deleteSelectedLetters,
            }}
        >
            {children}
        </CompleteLettersContext.Provider>
    );
}

export const useCompleteLetters = () => {
    return useContext(CompleteLettersContext);
};
