'use client';

import { useState } from 'react';
import { DataTable } from '@/app/admin/_components/data-table';
import { columns } from './notice-columns';
import { Plus, MoreHorizontal, Pencil, Trash, Eye, EyeOff } from 'lucide-react';
import { deleteNotices, toggleNoticeStatus } from '@/models/actions/notice-actions';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import TextLoader from '@/components/ui/text-loader';
import { NoticeDialog } from './notice-dialog';
import { Button } from '@/components/ui/button';
import { useNotices } from '../_contexts/notices-provider';
import { useConfirm } from '@/contexts/confirm-provider';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';
import { NoticePublic } from '@/models/types/notice';

export default function NoticeTable() {
    const {
        notices,
        isLoading,
        selectedNotices,
        setSelectedNotices,
        removeNotice,
        removeNotices,
        refreshNotices,
        updateNoticeInList,
    } = useNotices();

    const { confirm } = useConfirm();
    const [_isDeleting, setIsDeleting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState<NoticePublic | undefined>(undefined);
    const [_isBulkActionLoading, setIsBulkActionLoading] = useState(false);

    const handleDelete = async (noticeId: string) => {
        const confirmed = await confirm({
            title: '공지사항 삭제',
            description: '이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
            confirmText: '삭제',
            cancelText: '취소',
            className: '!bg-white',
        });

        if (!confirmed) return;

        try {
            setIsDeleting(true);
            const result = await deleteNotices(noticeId);

            if (result.success) {
                toast.success('공지사항이 성공적으로 삭제되었습니다.');
                removeNotice(noticeId);
            } else {
                toast.error(result.error.message || '공지사항 삭제 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('공지사항 삭제 오류:', error);
            toast.error('공지사항 삭제 중 오류가 발생했습니다.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleBulkDelete = async (selectedRows: NoticePublic[]) => {
        const ids = selectedRows.map(row => removeTableKeyPrefix(row.PK));
        if (!ids.length) return;

        const confirmed = await confirm({
            title: '공지사항 일괄 삭제',
            description: `선택한 ${ids.length}개의 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
            confirmText: '삭제',
            cancelText: '취소',
            className: '!bg-white',
        });

        if (!confirmed) return;

        try {
            setIsBulkActionLoading(true);
            const result = await deleteNotices(ids);

            if (result.success) {
                toast.success(`${ids.length}개의 공지사항이 삭제되었습니다.`);
                removeNotices(ids);
                setSelectedNotices([]);
            } else {
                toast.error(result.error.message || '공지사항 일괄 삭제 중 오류가 발생했습니다.');
                // 일부 삭제에 성공한 경우 목록 새로고침
                if (result.data?.deletedIds && result.data.deletedIds.length < ids.length) {
                    refreshNotices();
                }
            }
        } catch (error) {
            console.error('공지사항 일괄 삭제 오류:', error);
            toast.error('공지사항 일괄 삭제 중 오류가 발생했습니다.');
        } finally {
            setIsBulkActionLoading(false);
        }
    };

    const handleBulkToggleStatus = async (selectedRows: NoticePublic[], isPublished: boolean) => {
        const ids = selectedRows.map(row => removeTableKeyPrefix(row.PK));
        if (!ids.length) return;

        const statusText = isPublished ? '공개' : '비공개';
        const confirmed = await confirm({
            title: `공지사항 상태 변경`,
            description: `선택한 ${ids.length}개의 공지사항을 ${statusText} 상태로 변경하시겠습니까?`,
            confirmText: '변경',
            cancelText: '취소',
        });

        if (!confirmed) return;

        try {
            setIsBulkActionLoading(true);
            const result = await toggleNoticeStatus(ids, isPublished);

            if (result.success) {
                toast.success(
                    isPublished
                        ? `${ids.length}개의 공지사항이 공개 상태로 변경되었습니다.`
                        : `${ids.length}개의 공지사항이 비공개 상태로 변경되었습니다.`,
                );

                // 업데이트된 공지사항 상태 반영
                if (result.data?.updatedNotices) {
                    result.data.updatedNotices.forEach(notice => {
                        updateNoticeInList(removeTableKeyPrefix(notice.PK), notice);
                    });
                }

                setSelectedNotices([]);
            } else {
                toast.error(
                    result.error.message || '공지사항 상태 일괄 변경 중 오류가 발생했습니다.',
                );
                // 일부 업데이트에 성공한 경우 목록 새로고침
                if (result.data?.updatedNotices && result.data.updatedNotices.length > 0) {
                    refreshNotices();
                }
            }
        } catch (error) {
            console.error('공지사항 상태 일괄 변경 오류:', error);
            toast.error('공지사항 상태 일괄 변경 중 오류가 발생했습니다.');
        } finally {
            setIsBulkActionLoading(false);
        }
    };

    // 컬럼에 삭제 액션 추가
    const columnsWithActions = columns.map(col => {
        if (col.id === 'actions') {
            return {
                ...col,
                cell: ({ row }) => {
                    const notice = row.original;

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">관리 메뉴</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={e => {
                                        e.stopPropagation(); // 행 클릭 이벤트와 겹치지 않도록
                                        setSelectedNotice(notice);
                                        setIsDialogOpen(true);
                                    }}
                                >
                                    <Pencil className="h-4 w-4" />
                                    <span>수정</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleBulkToggleStatus([notice], !notice.isPublished);
                                    }}
                                >
                                    {notice.isPublished ? (
                                        <>
                                            <EyeOff className="h-4 w-4" />
                                            <span>비공개로 전환</span>
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="h-4 w-4" />
                                            <span>공개로 전환</span>
                                        </>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive flex items-center gap-2 cursor-pointer"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleDelete(removeTableKeyPrefix(notice.PK));
                                    }}
                                >
                                    <Trash className="h-4 w-4" />
                                    <span>삭제</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            };
        }

        return col;
    });

    if (isLoading) {
        return <TextLoader text="공지사항을 불러오는 중..." className="mt-32" />;
    }

    return (
        <div className="space-y-4">
            <DataTable
                columns={columnsWithActions}
                data={notices}
                showCheckbox={true}
                onSelectedRowsChange={selectedRows => {
                    // 선택된 행이 변경될 때만 상태 업데이트
                    const newSelectedIds = selectedRows.map(row => removeTableKeyPrefix(row.PK));
                    if (JSON.stringify(newSelectedIds) !== JSON.stringify(selectedNotices)) {
                        setSelectedNotices(newSelectedIds);
                    }
                }}
                actions={[
                    <Button
                        key="new-notice"
                        onClick={() => {
                            setSelectedNotice(undefined);
                            setIsDialogOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />새 공지사항
                    </Button>,
                ]}
                selectionActions={[
                    {
                        label: '일괄 삭제',
                        onClick: handleBulkDelete,
                        type: 'button',
                    },
                    {
                        label: '공개로 전환',
                        onClick: selectedRows => handleBulkToggleStatus(selectedRows, true),
                        type: 'button',
                    },
                    {
                        label: '비공개로 전환',
                        onClick: selectedRows => handleBulkToggleStatus(selectedRows, false),
                        type: 'button',
                    },
                ]}
                onRowClick={row => {
                    setSelectedNotice(row);
                    setIsDialogOpen(true);
                }}
            />

            <NoticeDialog
                notice={selectedNotice}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div>
    );
}
