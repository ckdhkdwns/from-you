'use client';

import { useState } from 'react';
import { DataTable } from '@/app/admin/_components/data-table';
import { columns } from './notice-columns';
import { deleteNotices, toggleNoticeStatus } from '@/models/actions/notice-actions';
import { toast } from 'sonner';
import { NoticeDialog } from './notice-dialog';
import { Button } from '@/components/ui/button';
import { useNotices } from '../_contexts/notices-provider';
import { useConfirm } from '@/contexts/confirm-provider';
import { NoticePublic } from '@/models/types/notice';
import { Plus } from 'lucide-react';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';

export default function NoticeDataTable() {
    const {
        isLoading,
        notices,
        setSelectedNotices,
        removeNotices: removeNoticesFromState,
        refreshNotices,
        updateNoticeInList,
    } = useNotices();

    const { confirm } = useConfirm();
    const [_isDeleting, setIsDeleting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState<NoticePublic | undefined>(undefined);

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
            setIsDeleting(true);
            try {
                const noticeIds = selectedRows.map(row => removeTableKeyPrefix(row.PK));
                const response = await deleteNotices(noticeIds);

                if (response.success) {
                    removeNoticesFromState(noticeIds);
                    setSelectedNotices([]);
                    toast.success(`${noticeIds.length}개의 공지사항이 삭제되었습니다.`);
                } else {
                    toast.error(response.error?.message || '공지사항 삭제 중 오류가 발생했습니다.');
                }
            } catch (error) {
                console.error('공지사항 일괄 삭제 오류:', error);
                toast.error('공지사항 삭제 중 오류가 발생했습니다.');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleBulkToggleStatus = async (selectedRows: NoticePublic[], isPublished: boolean) => {
        if (selectedRows.length === 0) {
            toast.error('선택된 공지사항이 없습니다.');
            return;
        }

        const action = isPublished ? '게시' : '숨김';
        const result = await confirm({
            title: `공지사항 ${action}`,
            description: `선택한 ${selectedRows.length}개의 공지사항을 ${action}하시겠습니까?`,
            className: 'bg-white',
        });

        if (result) {
            try {
                const noticeIds = selectedRows.map(row => removeTableKeyPrefix(row.PK));
                const response = await toggleNoticeStatus(noticeIds, isPublished);

                if (response.success) {
                    // 상태 업데이트
                    response.data.updatedNotices.forEach(updatedNotice => {
                        updateNoticeInList(removeTableKeyPrefix(updatedNotice?.SK), updatedNotice);
                    });

                    setSelectedNotices([]);
                    toast.success(`${noticeIds.length}개의 공지사항이 ${action}되었습니다.`);
                } else {
                    toast.error(
                        response.error?.message || `공지사항 ${action} 중 오류가 발생했습니다.`,
                    );
                }
            } catch (error) {
                console.error(`공지사항 ${action} 오류:`, error);
                toast.error(`공지사항 ${action} 중 오류가 발생했습니다.`);
            }
        }
    };

    const handleRowClick = (row: NoticePublic) => {
        setSelectedNotice(row);
        setIsDialogOpen(true);
    };

    const handleNoticeDialogClose = () => {
        setIsDialogOpen(false);
        refreshNotices();
    };

    return (
        <>
            {isLoading ? (
                <div className="flex justify-center items-center p-8">
                    <p>공지사항을 불러오는 중...</p>
                </div>
            ) : (
                <>
                    <NoticeDialog
                        notice={selectedNotice}
                        open={isDialogOpen}
                        onOpenChange={handleNoticeDialogClose}
                    />

                    <DataTable
                        columns={columns}
                        data={notices}
                        onSelectedRowsChange={rows =>
                            setSelectedNotices(rows.map(row => removeTableKeyPrefix(row.PK)))
                        }
                        onRowClick={handleRowClick}
                        actions={[
                            <Button
                                key="create"
                                onClick={() => {
                                    setSelectedNotice(undefined);
                                    setIsDialogOpen(true);
                                }}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                공지사항 추가
                            </Button>,
                        ]}
                        selectionActions={[
                            {
                                label: '선택 삭제',
                                onClick: handleBulkDelete,
                                type: 'button',
                            },
                            {
                                label: '선택 게시',
                                onClick: rows => handleBulkToggleStatus(rows, true),
                                type: 'button',
                            },
                            {
                                label: '선택 숨김',
                                onClick: rows => handleBulkToggleStatus(rows, false),
                                type: 'button',
                            },
                        ]}
                    />
                </>
            )}
        </>
    );
}
