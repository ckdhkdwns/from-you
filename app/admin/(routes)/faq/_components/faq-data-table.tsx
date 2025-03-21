'use client';

import { DataTable } from '@/app/admin/_components/data-table';
import { columns } from './faq-columns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useFAQs } from '../_contexts/faqs-provider';
import { useConfirm } from '@/contexts/confirm-provider';
import { FaqPublic } from '@/models/types/faq';
import { Plus } from 'lucide-react';

export default function FAQDataTable() {
    const {
        faqs,
        setSelectedFAQs,
        deleteFAQs,
        toggleFAQsStatus,
        handleRowClick,
        setSelectedFAQ,
        setIsDialogOpen,
    } = useFAQs();

    const { confirm } = useConfirm();

    const handleBulkDelete = async (selectedRows: FaqPublic[]) => {
        if (selectedRows.length === 0) {
            toast.error('선택된 FAQ가 없습니다.');
            return;
        }

        const result = await confirm({
            title: 'FAQ 일괄 삭제',
            description: `선택한 ${selectedRows.length}개의 FAQ를 삭제하시겠습니까?`,
            className: 'bg-white',
        });

        if (result) {
            await deleteFAQs(selectedRows);
        }
    };

    const handleBulkToggleStatus = async (selectedRows: FaqPublic[], isPublished: boolean) => {
        if (selectedRows.length === 0) {
            toast.error('선택된 FAQ가 없습니다.');
            return;
        }

        const action = isPublished ? '공개' : '비공개';
        const result = await confirm({
            title: `FAQ ${action}`,
            description: `선택한 ${selectedRows.length}개의 FAQ를 ${action}하시겠습니까?`,
            className: 'bg-white',
        });

        if (result) {
            await toggleFAQsStatus(selectedRows, isPublished);
        }
    };

    return (
        <DataTable
            storageKey="faqs"
            columns={columns}
            data={faqs}
            onSelectedRowsChange={setSelectedFAQs}
            onRowClick={handleRowClick}
            actions={[
                {
                    label: 'FAQ 추가',
                    onClick: () => {
                        setSelectedFAQ(undefined);
                        setIsDialogOpen(true);
                    },
                    type: 'button',
                    icon: <Plus className="h-4 w-4" />,
                },
            ]}
            selectionActions={[
                {
                    label: '삭제',
                    onClick: handleBulkDelete,
                    type: 'button',
                },
                {
                    label: '공개',
                    onClick: rows => handleBulkToggleStatus(rows, true),
                    type: 'button',
                },
                {
                    label: '비공개',
                    onClick: rows => handleBulkToggleStatus(rows, false),
                    type: 'button',
                },
            ]}
        />
    );
}
