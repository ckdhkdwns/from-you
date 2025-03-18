import React from 'react';
import { getMyLettersAction } from '@/models/actions/letter-actions';
import { MyLettersProvider } from '../_contexts/my-letters-provider';
import MyPageClient from './_components/my-page-client';

export default async function MyPage() {
    const { data: letters } = await getMyLettersAction();

    const draftLetters = letters.letters.filter(letter => letter.isDraft);
    const sentLetters = letters.letters.filter(letter => !letter.isDraft);

    console.log(draftLetters, sentLetters, letters.receivedLetters);
    return (
        <MyLettersProvider
            initialLetters={{
                draft: draftLetters,
                sent: sentLetters,
                received: letters.receivedLetters,
            }}
        >
            <MyPageClient />
        </MyLettersProvider>
    );
}
