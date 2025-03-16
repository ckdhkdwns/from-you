'use client';

import React, { useState } from 'react';
import SentLetterItem from './sent-letter-item';

import { useMyLetters } from '../../../_contexts/my-letters-provider';
import TextLoader from '@/components/ui/text-loader';
import { useUserData } from '@/contexts/session';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ReceivedLetterItem from './received-letter-item';

export default function LetterList() {
    const {
        letters,
        filter1,
        isLoading,
        handleDeleteLetter: handleDeleteLetterFromContext,
    } = useMyLetters();
    const { userData } = useUserData();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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

    const handleDeleteConfirm = () => {
        if (letterToDelete) {
            handleDeleteLetterFromContext(letterToDelete.userId, letterToDelete.letterId);
            setLetterToDelete(null);
        }
    };

    const handleDeleteRequest = (userId: string, letterId: string) => {
        setLetterToDelete({ userId, letterId });
        setIsDeleteDialogOpen(true);
    };

    return (
        <>
            <div className="flex flex-col gap-6">
                {letters.map((letter, index) => {
                    if (letter?.SK.includes('RECEIVED_LETTER')) {
                        return <ReceivedLetterItem key={index} letter={letter} />;
                    }
                    return (
                        <SentLetterItem
                            key={index}
                            letter={letter}
                            onDelete={() => handleDeleteRequest(userData?.id, letter.id)}
                            letterType={filter1.value as 'sent' | 'received' | 'draft'}
                        />
                    );
                })}

                {letters.length === 0 && (
                    <div className="p-4 text-center text-gray-400">편지 내역이 없습니다.</div>
                )}
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>편지 삭제</AlertDialogTitle>
                        <AlertDialogDescription>
                            정말로 이 편지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>삭제</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
