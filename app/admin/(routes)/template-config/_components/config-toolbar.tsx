'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TemplateConfigPublic } from '../../../../../models/types/template-config';
import { saveTemplateConfigAction } from '@/models/actions/config-actions';
import { toast } from 'sonner';
import LinearTabs from '@/components/ui/linear-tabs';
import DimensionControl from './dimension-control';
import PaperSizeControl from './paper-size-control';
import PaddingControl from './padding-control';
import FontSizeControl from './font-size-control';
import PhotoSizeControl from './photo-size-control';

interface ConfigToolbarProps {
    initialConfig?: TemplateConfigPublic;
    onConfigChange?: (_config: TemplateConfigPublic) => void;
    onSaveConfig?: () => Promise<void>;
}

const fontSizeConfig = {
    small: {
        default: 3,
        min: 1,
        max: 10,
    },
    medium: {
        default: 4,
        min: 1,
        max: 10,
    },
    large: {
        default: 5,
        min: 1,
        max: 10,
    },
};

export default function ConfigToolbar({
    initialConfig,
    onConfigChange,
    onSaveConfig,
}: ConfigToolbarProps) {
    const [config, setConfig] = useState<TemplateConfigPublic>(
        initialConfig || {
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
            lineHeight: 6, // mm
            fontSize: {
                small: fontSizeConfig.small.default, // mm
                medium: fontSizeConfig.medium.default, // mm
                large: fontSizeConfig.large.default, // mm
            },
        },
    );

    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('paper-size');

    const tabs = [
        {
            label: '종이 크기',
            value: 'paper-size',
            onClick: () => setActiveTab('paper-size'),
        },
        {
            label: '사진 크기',
            value: 'photo-size',
            onClick: () => setActiveTab('photo-size'),
        },
        {
            label: '여백',
            value: 'padding',
            onClick: () => setActiveTab('padding'),
        },
        {
            label: '줄 간격',
            value: 'line-height',
            onClick: () => setActiveTab('line-height'),
        },
        {
            label: '글자 크기',
            value: 'font-size',
            onClick: () => setActiveTab('font-size'),
        },
    ];

    useEffect(() => {
        if (initialConfig) {
            setConfig(initialConfig);
        }
    }, [initialConfig]);

    const handlePaperSizeChange = (dimension: 'width' | 'height', value: number) => {
        const newConfig = {
            ...config,
            paperSize: {
                ...config.paperSize,
                [dimension]: value,
            },
        };
        setConfig(newConfig);
        onConfigChange?.(newConfig);
    };

    const handlePhotoSizeChange = (dimension: 'width' | 'height', value: number) => {
        const newConfig = {
            ...config,
            photoSize: {
                ...config.photoSize,
                [dimension]: value,
            },
        };
        setConfig(newConfig);
        onConfigChange?.(newConfig);
    };

    const handlePaddingChange = (side: 'top' | 'right' | 'bottom' | 'left', value: number) => {
        const newConfig = {
            ...config,
            padding: {
                ...config.padding,
                [side]: value,
            },
        };
        setConfig(newConfig);
        onConfigChange?.(newConfig);
    };

    const handleLineHeightChange = (value: number) => {
        const newConfig = {
            ...config,
            lineHeight: value,
        };
        setConfig(newConfig);
        onConfigChange?.(newConfig);
    };

    const handleFontSizeChange = (size: 'small' | 'medium' | 'large', value: number) => {
        const newConfig = {
            ...config,
            fontSize: {
                ...config.fontSize,
                [size]: value,
            },
        };
        setConfig(newConfig);
        onConfigChange?.(newConfig);
    };

    const handlePaperPreset = (preset: string) => {
        let newPaperSize = { ...config.paperSize };

        switch (preset) {
            case 'a4':
                newPaperSize = { width: 210, height: 297 };
                break;
            case 'a5':
                newPaperSize = { width: 148, height: 210 };
                break;
            case 'letter':
                newPaperSize = { width: 216, height: 279 };
                break;
            case 'square':
                newPaperSize = { width: 210, height: 210 };
                break;
        }

        const newConfig = {
            ...config,
            paperSize: newPaperSize,
        };

        setConfig(newConfig);
        onConfigChange?.(newConfig);
    };

    const handleSaveConfig = async () => {
        if (onSaveConfig) {
            await onSaveConfig();
        } else {
            try {
                setIsSaving(true);
                const result = await saveTemplateConfigAction(config);

                if (result.success) {
                    toast.success('설정이 성공적으로 저장되었습니다.');
                } else {
                    const errorMessage = result.error
                        ? typeof result.error === 'string'
                            ? result.error
                            : result.error.message || '설정 저장 중 오류가 발생했습니다.'
                        : '설정 저장 중 오류가 발생했습니다.';
                    toast.error(errorMessage);
                }
            } catch (error) {
                console.error('설정 저장 오류:', error);
                toast.error('설정 저장 중 오류가 발생했습니다.');
            } finally {
                setIsSaving(false);
            }
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto mt-6 pt-6 flex flex-col gap-4">
            <LinearTabs tabs={tabs} activeTab={tabs.find(tab => tab.value === activeTab)} />

            {activeTab === 'paper-size' && (
                <PaperSizeControl
                    paperSize={config.paperSize}
                    onPaperSizeChange={handlePaperSizeChange}
                    onPaperPreset={handlePaperPreset}
                />
            )}

            {activeTab === 'photo-size' && (
                <PhotoSizeControl
                    photoSize={config.photoSize}
                    onPhotoSizeChange={handlePhotoSizeChange}
                />
            )}

            {activeTab === 'padding' && (
                <PaddingControl padding={config.padding} onPaddingChange={handlePaddingChange} />
            )}

            {activeTab === 'line-height' && (
                <div className="space-y-4">
                    <DimensionControl
                        id="line-height"
                        label="줄 간격 (mm)"
                        value={config.lineHeight}
                        onChange={handleLineHeightChange}
                        min={3}
                        max={15}
                        step={0.1}
                    />
                </div>
            )}

            {activeTab === 'font-size' && (
                <FontSizeControl
                    fontSize={config.fontSize}
                    fontSizeConfig={fontSizeConfig}
                    onFontSizeChange={handleFontSizeChange}
                />
            )}

            <div className="flex justify-end mt-6">
                <Button onClick={handleSaveConfig} disabled={isSaving}>
                    {isSaving ? '저장 중...' : '설정 저장'}
                </Button>
            </div>
        </div>
    );
}
