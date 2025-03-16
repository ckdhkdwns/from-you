import React from 'react';
import LetterList from './_components/letter-list';
import LetterTypeTabs from './_components/tabs/letter-type-tabs';
import StatusTabs from './_components/tabs/status-tabs';
import { MyLettersProvider } from '../../_contexts/my-letters-provider';
import { getMyLettersAction } from '@/models/actions/letter-actions';

export default async function page({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const { error } = await searchParams;
    const response = await getMyLettersAction();
    const initialLetters = response.data;

    return (
        <MyLettersProvider initialLetters={initialLetters} error={error}>
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
