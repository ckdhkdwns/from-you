'use client';

import { DataTable } from '@/app/admin/_components/data-table';
import { columns } from './notice-columns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useNotices } from '../_contexts/notices-provider';
import { useConfirm } from '@/contexts/confirm-provider';
import { NoticePublic } from '@/models/types/notice';
import { Plus } from 'lucide-react';

export default function NoticeDataTable() {
    const {
        notices,
        setSelectedNotices,
        deleteNotices,
        toggleNoticesStatus,
        handleRowClick,
        setSelectedNotice,
        setIsDialogOpen,
    } = useNotices();

    const { confirm } = useConfirm();

    const handleBulkDelete = async (selectedRows: NoticePublic[]) => {
        if (selectedRows.length === 0) {
            toast.error('선택된 공지사항이 없습니다.');
            return;
        }

        const result = await confirm({
            title: '공지사항 일괄 삭제',
            description: `선택한 ${selectedRows.length}개의 공지사항을 삭제하시겠습니까?`,
            className: 'bg-white',
        });

        if (result) {
            await deleteNotices(selectedRows);
        }
    };

    const handleBulkToggleStatus = async (selectedRows: NoticePublic[], isPublished: boolean) => {
        if (selectedRows.length === 0) {
            toast.error('선택된 공지사항이 없습니다.');
            return;
        }

        const action = isPublished ? '공개' : '비공개';
        const result = await confirm({
            title: `공지사항 ${action}`,
            description: `선택한 ${selectedRows.length}개의 공지사항을 ${action}하시겠습니까?`,
            className: 'bg-white',
        });

        if (result) {
            await toggleNoticesStatus(selectedRows, isPublished);
        }
    };

    return (
        <DataTable
            columns={columns}
            data={notices}
            onSelectedRowsChange={setSelectedNotices}
            onRowClick={handleRowClick}
            actions={[
                {
                    label: '공지사항 추가',
                    onClick: () => {
                        setSelectedNotice(undefined);
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
