'use client';

import React, { useState } from 'react';
import { DataTable } from '../../../_components/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { TemplateDialog } from './template-dialog';
import { TemplatePublic } from '@/models/types/template';
import { useConfirm } from '@/contexts/confirm-provider';
import { deleteTemplate } from '@/models/actions/template-actions';
import { toast } from 'sonner';

interface TemplatesDataTableProps {
    initialTemplates: TemplatePublic[];
}

export function TemplatesDataTable({ initialTemplates }: TemplatesDataTableProps) {
    const [templates, setTemplates] = useState<TemplatePublic[]>(initialTemplates);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplatePublic | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { confirm } = useConfirm();

    const handleDeleteTemplates = async (selectedRows: TemplatePublic[]) => {
        if (!selectedRows.length) return;

        const isConfirmed = await confirm({
            title: '편지지 삭제',
            description: `선택한 ${selectedRows.length}개의 편지지를 삭제하시겠습니까?`,
            confirmText: '삭제',
            cancelText: '취소',
            className: 'bg-white',
        });

        if (isConfirmed) {
            try {
                const result = await deleteTemplate(selectedRows.map(template => template.PK));

                if (result.success) {
                    toast.success('템플릿이 성공적으로 삭제되었습니다.');
                    setTemplates(prevTemplates =>
                        prevTemplates.filter(template => !selectedRows.includes(template)),
                    );
                } else {
                    toast.error(result.error?.message || '템플릿 삭제 중 오류가 발생했습니다.');
                }
            } catch (error) {
                console.error('템플릿 삭제 오류:', error);
                toast.error('템플릿 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    const handleDialogOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setSelectedTemplate(null);
        }
    };

    const addTemplate = (template: TemplatePublic) => {
        setTemplates(prevTemplates => [template, ...prevTemplates]);
    };

    const updateTemplateInList = (id: string, updatedTemplate: Partial<TemplatePublic>) => {
        setTemplates(prevTemplates =>
            prevTemplates.map(template =>
                template.PK === id ? { ...template, ...updatedTemplate } : template,
            ),
        );
    };

    return (
        <>
            <DataTable
                columns={columns}
                data={templates}
                actions={[
                    <Button
                        key="template-dialog"
                        variant="outline"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        편지지 추가
                    </Button>,
                ]}
                selectionActions={[
                    {
                        label: '삭제',
                        onClick: handleDeleteTemplates,
                        type: 'button',
                    },
                ]}
                onRowClick={row => {
                    console.log('Row clicked:', row);
                    setSelectedTemplate(row);
                    setTimeout(() => {
                        setIsDialogOpen(true);
                    }, 0);
                }}
            />
            <TemplateDialog
                template={selectedTemplate}
                open={isDialogOpen}
                onOpenChange={handleDialogOpenChange}
                onTemplateAdd={addTemplate}
                onTemplateUpdate={updateTemplateInList}
            />
        </>
    );
}
