'use client';

import React, { useState } from 'react';
import { DataTable } from '../../../_components/data-table';
import { columns } from './columns';
import { useAdminReview } from '../_contexts/review-context';
import { useConfirm } from '@/contexts/confirm-provider';
import { toast } from 'sonner';
import { ReviewPublic } from '@/models/types/review';

export default function ReviewDataTable() {
    const { reviews, deleteMultipleReviews, toggleMultipleBestReviews } = useAdminReview();
    const [selectedReviews, setSelectedReviews] = useState<ReviewPublic[]>([]);
    const { confirm } = useConfirm();

    const handleDeleteSelected = async () => {
        if (selectedReviews.length === 0) {
            toast.error('선택된 리뷰가 없습니다.');
            return;
        }

        const result = await confirm({
            title: '리뷰 삭제',
            description: `선택한 ${selectedReviews.length}개의 리뷰를 삭제하시겠습니까?`,
            className: 'bg-white',
        });

        if (result) {
            await deleteMultipleReviews(selectedReviews);
            toast.success('리뷰가 삭제되었습니다.');
        }
    };

    const handleToggleBestSelected = async (isBest: boolean) => {
        if (selectedReviews.length === 0) {
            toast.error('선택된 리뷰가 없습니다.');
            return;
        }

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
            toast.success(`리뷰가 ${action}되었습니다.`);
        }
    };

    return (
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
    );
}
