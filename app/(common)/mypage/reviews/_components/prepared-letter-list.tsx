'use client';

import React from 'react';
import SentLetterItem from '../../letters/[type]/_components/sent-letter-item';
import WriteReviewDialog from './write-review-dialog';
import { useReview } from '../_contexts/review-context';
import { removeTableKeyPrefix } from '@/lib/api-utils';

export default function PreparedLetterList() {
    const { openReviewDialog, preparedLetters } = useReview();
    return (
        <div className="space-y-8">
            {preparedLetters.map(letter => {
                const letterId = removeTableKeyPrefix(letter?.SK);
                return (
                    <SentLetterItem
                        key={letterId}
                        letter={letter}
                        letterType="sent"
                        isPrepared={true}
                        onDelete={() => {}}
                        onOpenReviewDialog={openReviewDialog}
                    />
                );
            })}
            <WriteReviewDialog />
        </div>
    );
}
