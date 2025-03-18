import React from 'react';
import LetterList from './_components/letter-list';
import LetterTypeTabs from './_components/tabs/letter-type-tabs';
import StatusTabs from './_components/tabs/status-tabs';
import { MyLettersProvider } from '../../_contexts/my-letters-provider';
import { getMyLettersAction } from '@/models/actions/letter-actions';
import { notFound } from 'next/navigation';

interface PageProps {
    searchParams: Promise<{ error?: string }>;
    params: Promise<{ type: string }>;
}

export default async function Page({ searchParams, params }: PageProps) {
    const { error } = await searchParams;
    const { type } = await params;

    // 유효하지 않은 타입인 경우 404 페이지로 리다이렉트
    if (!['sent', 'received', 'draft'].includes(type)) {
        notFound();
    }

    const { data: letters } = await getMyLettersAction();

    const draftLetters = letters.letters.filter(letter => letter.isDraft);
    const sentLetters = letters.letters.filter(letter => !letter.isDraft);

    return (
        <MyLettersProvider
            initialLetters={{
                draft: draftLetters,
                sent: sentLetters,
                received: letters.receivedLetters,
            }}
            error={error}
        >
            <div className="flex flex-col h-full">
                <div className="text-lg font-semibold mb-8">편지 내역</div>
                <LetterTypeTabs />
                {/* <DateFilter /> */}
                <div className="my-6">
                    <StatusTabs />
                </div>
                <LetterList />
            </div>
        </MyLettersProvider>
    );
}
