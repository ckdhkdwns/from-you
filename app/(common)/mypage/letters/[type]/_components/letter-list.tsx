'use client';

import React, { useState } from 'react';
import SentLetterItem from './sent-letter-item';

import { useMyLetters } from '../../../_contexts/my-letters-provider';
import TextLoader from '@/components/ui/text-loader';
import { useUserData } from '@/contexts/session';
import ReceivedLetterItem from './received-letter-item';
import { removeTableKeyPrefix } from '@/lib/api-utils';
import { useConfirm } from '@/contexts/confirm-provider';
import { ReceivedLetterPublic } from '@/models/types/received-letter';
import { LetterPublic } from '@/models/types/letter';

export default function LetterList() {
    const {
        letters,
        filter1,
        isLoading,
        handleDeleteLetter: handleDeleteLetterFromContext,
    } = useMyLetters();
    const { userData } = useUserData();
    const { confirm } = useConfirm();
    const [letterToDelete, setLetterToDelete] = useState<{
        userId: string;
        letterId: string;
    } | null>(null);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <TextLoader text="편지 내역을 불러오고 있습니다." className="my-auto" />
            </div>
        );
    }

    const handleDeleteConfirm = async () => {
        if (letterToDelete) {
            const confirmed = await confirm({
                title: '편지 삭제',
                description: '정말로 이 편지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
                confirmText: '삭제',
                cancelText: '취소',
            });

            if (confirmed) {
                handleDeleteLetterFromContext(letterToDelete.userId, letterToDelete.letterId);
                setLetterToDelete(null);
            }
        }
    };

    const handleDeleteRequest = (userId: string, letterId: string) => {
        setLetterToDelete({ userId, letterId });
        handleDeleteConfirm();
    };

    return (
        <div className="flex flex-col gap-6">
            {letters.map((letter, index) => {
                if (letter?.SK.includes('RECEIVED_LETTER')) {
                    return (
                        <ReceivedLetterItem key={index} letter={letter as ReceivedLetterPublic} />
                    );
                }
                return (
                    <SentLetterItem
                        key={index}
                        letter={letter as LetterPublic}
                        onDelete={() =>
                            handleDeleteRequest(userData?.id, removeTableKeyPrefix(letter.SK))
                        }
                        letterType={filter1.value as 'sent' | 'received' | 'draft'}
                    />
                );
            })}

            {letters.length === 0 && (
                <div className="p-4 text-center text-gray-400">편지 내역이 없습니다.</div>
            )}
        </div>
    );
}
