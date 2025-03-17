import React from 'react';
import LetterList from './_components/letter-list';
import LetterTypeTabs from './_components/tabs/letter-type-tabs';
import StatusTabs from './_components/tabs/status-tabs';
import { MyLettersProvider } from '../../_contexts/my-letters-provider';
import { getMyLettersAction } from '@/models/actions/letter-actions';
import { notFound } from 'next/navigation';

interface PageProps {
    searchParams: { error?: string };
    params: { type: string };
}

export default async function Page({ searchParams, params }: PageProps) {
    const { error } = searchParams;
    const { type } = params;

    // 유효하지 않은 타입인 경우 404 페이지로 리다이렉트
    if (!['sent', 'received', 'draft'].includes(type)) {
        notFound();
    }

    try {
        const { data: letters } = await getMyLettersAction();

        const draftLetters = letters.letters.filter(letter => letter.isDraft);
        const sentLetters = letters.letters.filter(letter => !letter.isDraft);

        return (
            <MyLettersProvider
                initialLetters={{
                    draftLetters,
                    sentLetters,
                    receivedLetters: letters.receivedLetters,
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
    } catch (error) {
        console.error('편지 목록을 불러오는 중 오류가 발생했습니다:', error);
        throw new Error('편지 목록을 불러오는데 실패했습니다.');
    }
}
