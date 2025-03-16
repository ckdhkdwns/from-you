'use client';

import React from 'react';
import LetterDataTable from './letter-data-table';
import { useCompleteLetters } from '../../../_contexts/complete-letters-provider';

export default function LettersContent() {
    const { letters, isLoading } = useCompleteLetters();

    return (
        <LetterDataTable
            data={letters}
            isLoading={isLoading}
            showNotificationReset={true}
            showDetailDialog={true}
            showActionsToolbar={true}
        />
    );
}
