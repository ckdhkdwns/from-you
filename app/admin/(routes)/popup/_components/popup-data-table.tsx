'use client';

import { DataTable } from '@/app/admin/_components/data-table';
import { columns } from './popup-columns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { usePopups } from '../_contexts/popups-provider';
import { useConfirm } from '@/contexts/confirm-provider';
import { PopupPublic } from '@/models/types/popup';
import { Plus } from 'lucide-react';
import TextLoader from '@/components/ui/text-loader';

export default function PopupDataTable() {
    const {
        popups,
        isActionLoading,
        setSelectedPopups,
        deletePopups,
        handleRowClick,
        setSelectedPopup,
        setIsDialogOpen,
    } = usePopups();

    const { confirm } = useConfirm();

    const handleBulkDelete = async (selectedRows: PopupPublic[]) => {
        if (selectedRows.length === 0) {
            toast.error('선택된 팝업이 없습니다.');
            return;
        }

        const result = await confirm({
            title: '팝업 일괄 삭제',
            description: `선택한 ${selectedRows.length}개의 팝업을 삭제하시겠습니까?`,
            className: 'bg-white',
        });

        if (result) {
            await deletePopups(selectedRows);
        }
    };

    if (isActionLoading) return <TextLoader text="불러오는 중..." className="mt-24" />;

    return (
        <DataTable
            storageKey="popups"
            columns={columns}
            data={popups}
            onSelectedRowsChange={setSelectedPopups}
            onRowClick={handleRowClick}
            actions={[
                {
                    label: '팝업 추가',
                    onClick: () => {
                        setSelectedPopup(undefined);
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
            ]}
        />
    );
}
