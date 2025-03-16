import React from 'react';
import { getTemplateConfigAction } from '@/models/actions/config-actions';
import { TemplateConfigProvider } from './_contexts/template-config-provider';
import TemplateConfigContent from './_components/template-config-content';
import { TemplateConfigPublic } from '@/models/types/template-config';

export default async function TemplateConfigPage() {
    const configResult = await getTemplateConfigAction();

    // 기본 설정값
    const defaultConfig: TemplateConfigPublic = {
        PK: 'CONFIG#TEMPLATE_CONFIG' as const,
        SK: 'CONFIG#TEMPLATE_CONFIG' as const,
        paperSize: {
            width: 210, // A4 기본 너비 (mm)
            height: 297, // A4 기본 높이 (mm)
        },
        photoSize: {
            width: 50, // 기본 사진 너비 (mm)
            height: 70, // 기본 사진 높이 (mm)
        },
        padding: {
            top: 20, // mm
            right: 20, // mm
            bottom: 20, // mm
            left: 20, // mm
        },
        lineHeight: 6, // mm (약 24px에 해당)
        fontSize: {
            small: 3, // mm (약 12pt에 해당)
            medium: 4, // mm (약 16pt에 해당)
            large: 5, // mm (약 20pt에 해당)
        },
    };

    const config = configResult.success && configResult.data ? configResult.data : defaultConfig;

    return (
        <TemplateConfigProvider initialConfig={config}>
            <TemplateConfigContent />
        </TemplateConfigProvider>
    );
}
