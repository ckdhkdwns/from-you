'use client';

import { DataTable } from '@/app/admin/_components/data-table';
import { useFAQs } from '../_contexts/faqs-provider';
import { columns } from './faq-columns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { FaqPublic } from '@/models/types/faq';
import { useConfirm } from '@/contexts/confirm-provider';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';
import TextLoader from '@/components/ui/text-loader';

// FAQ를 컴포넌트에서 사용하기 편한 형태로 변환하는 유틸리티 함수
const convertToFAQ = (faq: FaqPublic) => {
    return {
        id: removeTableKeyPrefix(faq?.SK),
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        order: faq.order,
        isPublished: faq.isPublished,
        createdAt: faq.createdAt,
        SK: faq?.SK,
        PK: faq.PK,
    };
};

export function FAQDataTable() {
    const {
        faqs,
        isLoading,

        setSelectedFAQs,

        setIsDialogOpen,
        setSelectedFAQ,
        handleDeleteFAQs,
        handleToggleFAQStatus,
    } = useFAQs();
    const { confirm } = useConfirm();

    // 변환된 FAQ 데이터
    const faqsConverted = faqs.map(convertToFAQ);

    // 새 FAQ 생성 다이얼로그 열기
    const handleNewFAQ = () => {
        setSelectedFAQ(undefined);
        setIsDialogOpen(true);
    };

    // FAQ 행 클릭 시 상세보기/수정 다이얼로그 열기
    const handleRowClick = (row: FaqPublic) => {
        const originalFaq = faqs.find(faq => removeTableKeyPrefix(faq?.SK) === row?.SK);
        if (originalFaq) {
            setSelectedFAQ(originalFaq);
            setIsDialogOpen(true);
        }
    };

    // 선택된 행 변경 핸들러
    const handleSelectedRowsChange = (rows: FaqPublic[]) => {
        setSelectedFAQs(rows.map(row => row?.SK));
    };

    // 선택 액션 정의
    const selectionActions = [
        {
            type: 'button' as const,
            label: '선택 삭제',
            onClick: async (selectedRows: FaqPublic[]) => {
                if (selectedRows.length === 0) return;

                const confirmed = await confirm({
                    title: 'FAQ 삭제',
                    description: `선택한 ${selectedRows.length}개의 FAQ를 삭제하시겠습니까?`,
                    confirmText: '삭제',
                    cancelText: '취소',
                });

                if (confirmed) {
                    const ids = selectedRows.map(row => row?.SK);
                    await handleDeleteFAQs(ids);
                }
            },
        },
        {
            type: 'button' as const,
            label: '선택 게시',
            onClick: async (selectedRows: FaqPublic[]) => {
                if (selectedRows.length === 0) return;

                const confirmed = await confirm({
                    title: 'FAQ 게시',
                    description: `선택한 ${selectedRows.length}개의 FAQ를 게시 처리하시겠습니까?`,
                    confirmText: '게시',
                    cancelText: '취소',
                });

                if (confirmed) {
                    const ids = selectedRows.map(row => row?.SK);
                    await handleToggleFAQStatus(ids, true);
                }
            },
        },
        {
            type: 'button' as const,
            label: '선택 숨김',
            onClick: async (selectedRows: FaqPublic[]) => {
                if (selectedRows.length === 0) return;

                const confirmed = await confirm({
                    title: 'FAQ 숨김',
                    description: `선택한 ${selectedRows.length}개의 FAQ를 숨김 처리하시겠습니까?`,
                    confirmText: '숨김',
                    cancelText: '취소',
                });

                if (confirmed) {
                    const ids = selectedRows.map(row => row?.SK);
                    await handleToggleFAQStatus(ids, false);
                }
            },
        },
    ];

    if (isLoading) {
        return <TextLoader text="FAQ를 불러오는 중..." className="mt-24" />;
    }

    return (
        <>
            <DataTable
                columns={columns}
                data={faqsConverted}
                onSelectedRowsChange={handleSelectedRowsChange}
                onRowClick={handleRowClick}
                actions={[
                    <Button key="create" onClick={handleNewFAQ}>
                        <Plus className="mr-2 h-4 w-4" />
                        FAQ 추가
                    </Button>,
                ]}
                selectionActions={selectionActions}
                // searchField={["question"]}
                // searchPlaceholder="질문으로 검색..."
            />
        </>
    );
}
