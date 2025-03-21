'use client';

import { useState } from 'react';
import { DataTable } from '@/app/admin/_components/data-table';
import { columns } from './popup-columns';
import { deletePopupAction } from '@/models/actions/popup-actions';
import { toast } from 'sonner';
import { PopupDialog } from './popup-dialog';
import { Button } from '@/components/ui/button';
import { usePopups } from '../_contexts/popups-provider';
import { useConfirm } from '@/contexts/confirm-provider';
import { Plus } from 'lucide-react';
import { PopupPublic } from '@/models/types/popup';
import { CreatePopupDialog } from './create-popup-dialog';
import TextLoader from '@/components/ui/text-loader';
import { removeTableKeyPrefix } from '@/lib/api-utils';

export default function PopupDataTable() {
    const {
        popups,
        isLoading,

        setSelectedPopups,

        removePopups,
        refreshPopups,
    } = usePopups();

    const { confirm } = useConfirm();
    const [selectedPopup, setSelectedPopup] = useState<PopupPublic | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    // 일괄 삭제 처리
    const handleBulkDelete = async (selectedRows: PopupPublic[]) => {
        if (selectedRows.length === 0) return;

        const confirmed = await confirm({
            title: '팝업 일괄 삭제',
            description: `선택한 ${selectedRows.length}개의 팝업을 삭제하시겠습니까?`,
            confirmText: '삭제',
            cancelText: '취소',
        });

        if (!confirmed) return;

        setIsBulkDeleting(true);
        try {
            const popupIds = selectedRows.map(row => removeTableKeyPrefix(row.PK));

            // 각 팝업에 대해 삭제 작업 수행
            const deletePromises = popupIds.map(async id => {
                try {
                    const { success } = await deletePopupAction(id);
                    return success;
                } catch (error) {
                    console.error(`팝업 삭제 오류 (ID: ${id}):`, error);
                    return false;
                }
            });

            const results = await Promise.all(deletePromises);
            const successCount = results.filter(Boolean).length;

            if (successCount === popupIds.length) {
                toast.success(`${successCount}개의 팝업이 삭제되었습니다.`);
                removePopups(popupIds);
            } else if (successCount > 0) {
                toast.warning(`${successCount}/${popupIds.length}개의 팝업이 삭제되었습니다.`);
                await refreshPopups();
            } else {
                toast.error('팝업 삭제에 실패했습니다.');
            }

            setSelectedPopups([]);
        } catch (error) {
            console.error('팝업 일괄 삭제 오류:', error);
            toast.error('팝업 삭제 중 오류가 발생했습니다.');
        } finally {
            setIsBulkDeleting(false);
        }
    };

    const handleRowClick = (row: PopupPublic) => {
        setSelectedPopup(row);
        setIsDialogOpen(true);
    };

    const handlePopupDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedPopup(null);
    };

    if (isLoading) return <TextLoader text="불러오는 중..." className="mt-24" />;

    return (
        <div className="space-y-4">
            <DataTable
                columns={columns}
                data={popups}
                onRowClick={handleRowClick}
                showCheckbox={true}
                actions={[
                    <Button onClick={() => setIsCreateDialogOpen(true)} key="create">
                        <Plus className="mr-2 h-4 w-4" />새 팝업 추가
                    </Button>,
                ]}
                selectionActions={[
                    {
                        label: isBulkDeleting ? '삭제 중...' : '일괄 삭제',
                        onClick: handleBulkDelete,
                        type: 'button',
                        // disabled: isBulkDeleting,
                    },
                ]}
            />

            {/* 팝업 수정 다이얼로그 */}
            {selectedPopup && (
                <PopupDialog
                    popup={selectedPopup}
                    open={isDialogOpen}
                    onOpenChange={handlePopupDialogClose}
                />
            )}

            {/* 팝업 생성 다이얼로그 */}
            <CreatePopupDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
        </div>
    );
}
