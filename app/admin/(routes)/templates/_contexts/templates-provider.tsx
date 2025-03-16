'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { deleteTemplate, getAllTemplates } from '@/models/actions/template-actions';
import { TemplatePublic } from '@/models/types/template';
import { toast } from 'sonner';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';

const TemplatesContext = createContext<{
    templates: TemplatePublic[];
    isLoading: boolean;
    error: string | null;
    selectedTemplate: TemplatePublic | null;
    setSelectedTemplate: (_template: TemplatePublic) => void;
    isDialogOpen: boolean;
    setIsDialogOpen: (_open: boolean) => void;
    handleDeleteTemplates: (_selectedRows: TemplatePublic[]) => void;
    addTemplate: (_template: TemplatePublic) => void;
    updateTemplateInList: (_id: string, _updatedTemplate: Partial<TemplatePublic>) => void;
}>({
    templates: [],
    isLoading: true,
    error: null,
    selectedTemplate: null,
    setSelectedTemplate: () => {},
    isDialogOpen: false,
    setIsDialogOpen: () => {},
    handleDeleteTemplates: () => {},
    addTemplate: () => {},
    updateTemplateInList: () => {},
});

export default function TemplatesProvider({ children }: { children: React.ReactNode }) {
    const [templates, setTemplates] = useState<TemplatePublic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplatePublic | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setSelectedTemplate(null);
        }
    };

    useEffect(() => {
        const fetchTemplates = async () => {
            const { success, data, error } = await getAllTemplates();
            if (success) {
                setTemplates(data);
            } else {
                setError(error.message);
            }
            setIsLoading(false);
        };
        fetchTemplates();
    }, []);

    const handleDeleteTemplates = async (selectedRows: TemplatePublic[]) => {
        const { success, error } = await deleteTemplate(selectedRows.map(template => template.PK));

        if (success) {
            toast.success('템플릿이 성공적으로 삭제되었습니다.');

            setTemplates(prevTemplates => {
                return prevTemplates.filter(template => !selectedRows.includes(template));
            });
        } else {
            toast.error(error.message);
        }
    };

    const addTemplate = (template: TemplatePublic) => {
        setTemplates(prevTemplates => [template, ...prevTemplates]);
    };

    const updateTemplateInList = (id: string, updatedTemplate: Partial<TemplatePublic>) => {
        setTemplates(prevTemplates =>
            prevTemplates.map(template =>
                removeTableKeyPrefix(template.PK) === id
                    ? { ...template, ...updatedTemplate }
                    : template,
            ),
        );
    };

    return (
        <TemplatesContext.Provider
            value={{
                templates,
                isLoading,
                error,
                selectedTemplate,
                setSelectedTemplate,
                isDialogOpen,
                setIsDialogOpen: handleDialogOpenChange,
                handleDeleteTemplates,
                addTemplate,
                updateTemplateInList,
            }}
        >
            {children}
        </TemplatesContext.Provider>
    );
}

export const useTemplates = () => {
    return useContext(TemplatesContext);
};
