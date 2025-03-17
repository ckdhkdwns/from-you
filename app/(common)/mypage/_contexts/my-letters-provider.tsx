'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { deleteLetterAction } from '@/models/actions/letter-actions';
import { LetterPublic } from '@/models/types/letter';
import { ReceivedLetterPublic } from '@/models/types/received-letter';
import { useParams, useRouter } from 'next/navigation';
import { getStatusText } from '../letters/[type]/_libs/get-status-text';
import { toast } from 'sonner';

export const letterTypeTabs: { label: string; value: string; href: string }[] = [
    { label: '보낸 편지', value: 'sent', href: '/mypage/letters/sent' },
    {
        label: '받은 편지',
        value: 'received',
        href: '/mypage/letters/received',
    },
    { label: '임시 저장', value: 'draft', href: '/mypage/letters/draft' },
];

export const statusTabs = [
    { label: '전체', value: 'all' },
    { label: '결제 대기중', value: 'payment-pending' },
    { label: '결제 완료', value: 'payment-complete' },
    { label: '배송 중', value: 'shipping' },
    { label: '배송 완료', value: 'shipping-complete' },
];

interface LettersState {
    draftLetters: LetterPublic[];
    sentLetters: LetterPublic[];
    receivedLetters: ReceivedLetterPublic[];
}

interface MyLettersContextType {
    letters: (LetterPublic | ReceivedLetterPublic)[];
    filter1: (typeof letterTypeTabs)[number];
    setFilter1: (filter: (typeof letterTypeTabs)[number]) => void;
    filter2: (typeof statusTabs)[number];
    setFilter2: (filter: (typeof statusTabs)[number]) => void;
    hideStatusTabs: boolean;
    isLoading: boolean;
    handleDeleteLetter: (userId: string, letterId: string) => Promise<void>;
    letterCount: {
        sent: number;
        received: number;
        draft: number;
    } | null;
}

export const MyLettersContext = createContext<MyLettersContextType>({
    letters: [],
    filter1: letterTypeTabs[0],
    setFilter1: () => {},
    filter2: statusTabs[0],
    setFilter2: () => {},
    hideStatusTabs: false,
    isLoading: false,
    handleDeleteLetter: async () => {},
    letterCount: null,
});

interface MyLettersProviderProps {
    children: React.ReactNode;
    initialLetters?: LettersState;
    error?: string;
}

export const MyLettersProvider = ({
    error,
    children,
    initialLetters = {
        draftLetters: [],
        sentLetters: [],
        receivedLetters: [],
    },
}: MyLettersProviderProps) => {
    const { type } = useParams();
    const router = useRouter();
    const [letters, setLetters] = useState<LettersState>(initialLetters);
    const [filter1, setFilter1] = useState<(typeof letterTypeTabs)[number]>(letterTypeTabs[0]);
    const [filter2, setFilter2] = useState<(typeof statusTabs)[number]>(statusTabs[0]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (error && error === 'already-paid') {
            toast.error('이미 결제된 편지입니다.');
            router.replace('/mypage/letters/sent');
        }
    }, [error, router]);

    useEffect(() => {
        setFilter1(letterTypeTabs.find(tab => tab.value === type) || letterTypeTabs[0]);

        if (type !== 'sent') {
            setFilter2(statusTabs[0]);
        }
    }, [type]);

    const filteredLetters = letters[filter1.value as keyof LettersState].filter(letter => {
        if (filter2.value === 'all') return true;
        
        // ReceivedLetterPublic 타입 체크
        if ('senderName' in letter) return true;
        
        // LetterPublic 타입인 경우에만 상태 필터링
        return (
            getStatusText({
                paymentStatus: letter.paymentStatus,
                shippingStatus: letter.shippingStatus,
            }) === filter2.label
        );
    });

    const handleDeleteLetter = async (userId: string, letterId: string) => {
        setIsLoading(true);
        try {
            const response = await deleteLetterAction(userId, letterId);

            if (response.success) {
                setLetters(prev => ({
                    ...prev,
                    [filter1.value]: prev[filter1.value as keyof LettersState].filter(
                        letter => letter.PK !== `USER#${letterId}`
                    ),
                }));
                toast.info('편지가 삭제되었습니다.');
            }
        } catch (error) {
            toast.error('편지 삭제 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const hideStatusTabs = type !== 'sent';

    return (
        <MyLettersContext.Provider
            value={{
                letters: filteredLetters,
                filter1,
                setFilter1,
                filter2,
                setFilter2,
                hideStatusTabs,
                isLoading,
                handleDeleteLetter,
                letterCount: {
                    sent: letters.sentLetters.length,
                    received: letters.receivedLetters.length,
                    draft: letters.draftLetters.length,
                },
            }}
        >
            {children}
        </MyLettersContext.Provider>
    );
};

export const useMyLetters = () => {
    const context = useContext(MyLettersContext);
    if (!context) {
        throw new Error('useMyLetters must be used within a MyLettersProvider');
    }
    return context;
};
