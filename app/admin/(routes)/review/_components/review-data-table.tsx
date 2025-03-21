'use client';

import React, { useState } from 'react';
import { DataTable } from '../../../_components/data-table';
import { columns } from './columns';
import { useAdminReview } from '../_contexts/review-provider';
import { useConfirm } from '@/contexts/confirm-provider';
import { ReviewPublic } from '@/models/types/review';
import { Loader2 } from 'lucide-react';

export default function ReviewDataTable() {
    const { reviews, deleteMultipleReviews, toggleMultipleBestReviews, isActionLoading } = useAdminReview();
    const [selectedReviews, setSelectedReviews] = useState<ReviewPublic[]>([]);
    const { confirm } = useConfirm();

    const handleDeleteSelected = async () => {
        if (selectedReviews.length === 0) return;

        const result = await confirm({
            title: '리뷰 삭제',
            description: `선택한 ${selectedReviews.length}개의 리뷰를 삭제하시겠습니까?`,
            className: 'bg-white',
        });

        if (result) {
            await deleteMultipleReviews(selectedReviews);
        }
    };

    const handleToggleBestSelected = async (isBest: boolean) => {
        if (selectedReviews.length === 0) return;

        const action = isBest ? '베스트 등록' : '베스트 해제';
        const result = await confirm({
            title: `리뷰 ${action}`,
            description:
                `선택한 ${selectedReviews.length}개의 리뷰를 ${action}하시겠습니까?` +
                (isBest
                    ? `\n${selectedReviews.length}명의 회원에게 포인트 3000점이 지급됩니다.`
                    : ''),
            className: 'bg-white',
        });

        if (result) {
            await toggleMultipleBestReviews(selectedReviews, isBest);
        }
    };

    return (
        <div className="relative">
            {isActionLoading && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
            
            <DataTable
                columns={columns}
                data={reviews}
                onSelectedRowsChange={setSelectedReviews}
                selectionActions={[
                    {
                        label: '선택 삭제',
                        onClick: () => handleDeleteSelected(),
                        type: 'button',
                    },
                    {
                        label: '베스트 등록',
                        onClick: () => handleToggleBestSelected(true),
                        type: 'button',
                    },
                    {
                        label: '베스트 해제',
                        onClick: () => handleToggleBestSelected(false),
                        type: 'button',
                    },
                ]}
            />
        </div>
    );
}
