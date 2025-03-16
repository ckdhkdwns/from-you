import React from 'react';
import { getReceivedLettersAction } from '@/models/actions/received-letter-action';
import { ReceivedLetterProvider } from './_contexts/received-letter-provider';
import ReceivedLetterDataTable from './_components/received-letter-data-table';

export default async function ReceivedLettersPage() {
    const { data: receivedLetters } = await getReceivedLettersAction();

    return (
        <ReceivedLetterProvider initialReceivedLetters={receivedLetters}>
            <ReceivedLetterDataTable />
        </ReceivedLetterProvider>
    );
}
