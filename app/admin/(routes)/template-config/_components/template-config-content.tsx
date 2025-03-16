'use client';

import React from 'react';
import PreviewPaper from '../../../../../components/papers/preview-paper';
import ConfigToolbar from './config-toolbar';
import { useTemplateConfig } from '../_contexts/template-config-provider';
import { saveTemplateConfigAction } from '@/models/actions/config-actions';
import { toast } from 'sonner';

export default function TemplateConfigContent() {
    const { config, updateConfig } = useTemplateConfig();

    const handleConfigChange = async (newConfig: typeof config) => {
        updateConfig(newConfig);
    };

    const handleSaveConfig = async () => {
        try {
            const result = await saveTemplateConfigAction(config);
            if (result.success) {
                toast.success('설정이 저장되었습니다.');
            } else {
                const errorMessage = result.error
                    ? typeof result.error === 'string'
                        ? result.error
                        : result.error.message || '설정 저장 중 오류가 발생했습니다.'
                    : '설정 저장 중 오류가 발생했습니다.';
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('설정 저장 중 오류:', error);
            toast.error('설정 저장 중 오류가 발생했습니다.');
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="order-2 lg:order-1">
                    <PreviewPaper config={config} paperImage="/blank-letter.png" />
                </div>
                <div className="order-1 lg:order-2">
                    <ConfigToolbar
                        initialConfig={config}
                        onConfigChange={handleConfigChange}
                        onSaveConfig={handleSaveConfig}
                    />
                </div>
            </div>
        </div>
    );
}
