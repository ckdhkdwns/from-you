'use client';

import React, { useEffect } from 'react';
import { DataTable } from '../../../_components/data-table';
import { columns } from './columns';
import { LetterDetailDialog } from './letter-detail-dialog/index';
import { useCompleteLetters } from '../../../_contexts/complete-letters-provider';
import TextLoader from '@/components/ui/text-loader';
import { useLetterActions } from '../_hooks/use-letter-actions';
import { LetterActionsToolbar } from './letter-actions-toolbar';
import { LetterPublic } from '@/models/types/letter';
import { ColumnDef } from '@tanstack/react-table';

interface LetterDataTableProps<TData = LetterPublic> {
    data?: TData[];
    isLoading?: boolean;
    onRowClick?: (_row: TData) => void;
    customColumns?: ColumnDef<TData>[];
    showCheckbox?: boolean;
    showDetailDialog?: boolean;
    showActionsToolbar?: boolean;
    showNotificationReset?: boolean;
    loadingText?: string;
    storageKey?: string;
}

export default function LetterDataTable<TData = LetterPublic>({
    data,
    isLoading,
    onRowClick,
    customColumns,
    showCheckbox = true,
    showDetailDialog = true,
    showActionsToolbar = true,
    showNotificationReset = true,
    loadingText = '편지 목록을 불러오고 있습니다...',
    storageKey,
}: LetterDataTableProps<TData>) {
    const completeLettersContext = useCompleteLetters();
    const { handleRowClick: defaultHandleRowClick } = useLetterActions();

    const letters = data || completeLettersContext.letters;
    const loading = isLoading !== undefined ? isLoading : completeLettersContext.isLoading;
    const rowClickHandler = onRowClick || defaultHandleRowClick;
    const tableColumns = (customColumns || columns) as ColumnDef<TData>[];

    useEffect(() => {
        if (showNotificationReset && completeLettersContext.resetNewLettersNotification) {
            completeLettersContext.resetNewLettersNotification();
        }
    }, [showNotificationReset, completeLettersContext]);

    if (loading) {
        return <TextLoader text={loadingText} className="mt-24" />;
    }

    return (
        <div>
            <DataTable
                columns={tableColumns}
                data={letters as TData[]}
                onRowClick={rowClickHandler as (_row: TData) => void}
                showCheckbox={showCheckbox}
                selectionActions={
                    showActionsToolbar
                        ? [
                              {
                                  type: 'component',
                                  render: selectedRows => (
                                      <LetterActionsToolbar
                                          selectedRows={selectedRows as LetterPublic[]}
                                      />
                                  ),
                              },
                          ]
                        : undefined
                }
                storageKey={storageKey}
            />
            {showDetailDialog && <LetterDetailDialog />}
        </div>
    );
}
