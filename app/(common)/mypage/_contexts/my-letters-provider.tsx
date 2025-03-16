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

export const MyLettersContext = createContext({
    letters: [],
    filter1: letterTypeTabs[0],
    setFilter1: (_filter: (typeof letterTypeTabs)[number]) => {},
    filter2: statusTabs[0],
    setFilter2: (_filter: (typeof statusTabs)[number]) => {},
    hideStatusTabs: false,
    isLoading: false,
    handleDeleteLetter: (_userId: string, _letterId: string) => {},
    letterCount: null,
});

const getStandardDate = (letter: LetterPublic) => {
    if (letter.isDraft) {
        return letter.updatedAt;
    }
    if (letter.paymentMethod === 'transfer') {
        return letter.transferRequestedAt;
    }
    if (letter.paymentMethod === 'point') {
        return letter.paymentCompletedAt;
    }
    return letter.paymentCompletedAt || letter.updatedAt;
};

const classifyLetters = ({
    letters,
    receivedLetters,
}: {
    letters: LetterPublic[];
    receivedLetters: ReceivedLetterPublic[];
}) => {
    const sortedLetters = letters.sort((a, b) => {
        const dateA = getStandardDate(a);
        const dateB = getStandardDate(b);
        return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    const classifiedLetters = sortedLetters.reduce(
        (acc, letter) => {
            if (letter.isDraft) {
                acc.draft.push(letter);
            } else {
                acc.sent.push(letter);
            }
            return acc;
        },
        {
            sent: [],
            received: [],
            draft: [],
        },
    );
    return { ...classifiedLetters, received: receivedLetters };
};

interface MyLettersProviderProps {
    children: React.ReactNode;
    initialLetters?: {
        letters: LetterPublic[];
        receivedLetters: ReceivedLetterPublic[];
    };
    error?: string;
}

export const MyLettersProvider = ({
    error,
    children,
    initialLetters = {
        letters: [],
        receivedLetters: [],
    },
}: MyLettersProviderProps) => {
    const { type } = useParams();
    const router = useRouter();
    const [letters, setLetters] = useState(() => classifyLetters(initialLetters));
    const [filter1, setFilter1] = useState<(typeof letterTypeTabs)[number]>(letterTypeTabs[0]);
    const [filter2, setFilter2] = useState<(typeof statusTabs)[number]>(statusTabs[0]);

    useEffect(() => {
        if (error && error === 'already-paid') {
            toast.error('이미 결제된 편지입니다.');
            router.replace('/mypage/letters/sent');
        }
    }, [error]);

    useEffect(() => {
        setFilter1(letterTypeTabs.find(tab => tab.value === type) || letterTypeTabs[0]);

        if (type !== 'sent') {
            setFilter2(statusTabs[0]);
        }
    }, [type]);

    const filteredLetters = letters[filter1.value as keyof typeof letters].filter(letter => {
        if (filter2.value === 'all') return true;
        return (
            getStatusText({
                paymentStatus: letter.paymentStatus,
                shippingStatus: letter.shippingStatus,
            }) === filter2.label
        );
    });

    const handleDeleteLetter = async (userId: string, letterId: string) => {
        const response = await deleteLetterAction(userId, letterId);
        if (response.success) {
            const newLetters = filteredLetters.filter(letter => letter.id !== letterId);
            setLetters(
                classifyLetters({
                    letters: newLetters,
                    receivedLetters: letters.received,
                }),
            );
            toast.info('편지가 삭제되었습니다.');
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
                isLoading: false,
                handleDeleteLetter,
                letterCount: {
                    sent: letters.sent.length,
                    received: letters.received.length,
                    draft: letters.draft.length,
                },
            }}
        >
            {children}
        </MyLettersContext.Provider>
    );
};

export const useMyLetters = () => {
    const {
        letters,
        filter1,
        filter2,
        setFilter1,
        setFilter2,
        hideStatusTabs,
        handleDeleteLetter,
        isLoading,
        letterCount,
    } = useContext(MyLettersContext);
    return {
        letters,
        filter1,
        filter2,
        setFilter1,
        setFilter2,
        hideStatusTabs,
        isLoading,
        handleDeleteLetter,
        letterCount,
    };
};
