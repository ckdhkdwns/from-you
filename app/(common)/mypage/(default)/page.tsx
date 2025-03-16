import React from 'react';
import { getMyLettersAction } from '@/models/actions/letter-actions';
import { MyLettersProvider } from '../_contexts/my-letters-provider';
import MyPageClient from './_components/my-page-client';

export default async function MyPage() {
    const response = await getMyLettersAction();
    const initialLetters = response.data;

    return (
        <MyLettersProvider initialLetters={initialLetters}>
            <MyPageClient />
        </MyLettersProvider>
    );
}
