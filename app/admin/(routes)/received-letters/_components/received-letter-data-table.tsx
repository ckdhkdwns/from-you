'use client';

import React, { useState, useCallback } from 'react';
import { DataTable } from '../../../_components/data-table';
import ReceivedLetterDialog from './received-letter-dialog';
import { useReceivedLetter } from '../_contexts/received-letter-provider';

import { Button } from '@/components/ui/button';
import { PlusIcon, Loader2 } from 'lucide-react';
import { useConfirm } from '@/contexts/confirm-provider';
import { ReceivedLetterPublic } from '@/models/types/received-letter';
import { columns } from './columns';

export default function ReceivedLetterDataTable() {
    const { receivedLetters, bulkDeleteReceivedLetters, isActionLoading } = useReceivedLetter();
    const [selectedLetter, setSelectedLetter] = useState<ReceivedLetterPublic | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { confirm } = useConfirm();

    const handleRowClick = useCallback((row: ReceivedLetterPublic) => {
        setSelectedLetter(row);
        setIsDialogOpen(true);
    }, []);

    const handleBulkDelete = async (selectedRows: ReceivedLetterPublic[]) => {
        const result = await confirm({
            title: '일괄 삭제',
            description: `선택한 ${selectedRows.length}개의 편지를 삭제하시겠습니까?`,
            className: 'bg-white',
        });

        if (result) {
            const letterIds = selectedRows.map((row: ReceivedLetterPublic) =>
                row?.SK.replace('RECEIVED_LETTER#', ''),
            );
            bulkDeleteReceivedLetters(letterIds);
        }
    };

    const tableActions = [
        {
            label: '편지 추가',
            onClick: () => setIsDialogOpen(true),
            type: 'button' as const,
            icon: <PlusIcon className="w-4 h-4" />
        }
    ];

    const tableSelectionActions = [
        {
            label: '일괄 삭제',
            onClick: handleBulkDelete,
            type: 'button' as const
        }
    ];

    return (
        <>
            <ReceivedLetterDialog
                selectedLetter={selectedLetter}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />

            <div className="relative">
                {isActionLoading && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                
                <DataTable
                    columns={columns}
                    data={receivedLetters}
                    onRowClick={handleRowClick}
                    actions={tableActions}
                    selectionActions={tableSelectionActions}
                />
            </div>
        </>
    );
}
