'use client';

import React from 'react';
import DimensionControl from './dimension-control';

interface FontSize {
    small: number;
    medium: number;
    large: number;
}

interface FontSizeConfig {
    small: {
        default: number;
        min: number;
        max: number;
    };
    medium: {
        default: number;
        min: number;
        max: number;
    };
    large: {
        default: number;
        min: number;
        max: number;
    };
}

interface FontSizeControlProps {
    fontSize: FontSize;
    fontSizeConfig: FontSizeConfig;
    onFontSizeChange: (_size: 'small' | 'medium' | 'large', _value: number) => void;
}

export default function FontSizeControl({
    fontSize,
    fontSizeConfig,
    onFontSizeChange,
}: FontSizeControlProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-6">
                <DimensionControl
                    id="font-size-small"
                    label="작은 글자 크기 (mm)"
                    value={fontSize.small}
                    onChange={value => onFontSizeChange('small', value)}
                    min={fontSizeConfig.small.min}
                    max={fontSizeConfig.small.max}
                    step={0.1}
                />

                <DimensionControl
                    id="font-size-medium"
                    label="중간 글자 크기 (mm)"
                    value={fontSize.medium}
                    onChange={value => onFontSizeChange('medium', value)}
                    min={fontSizeConfig.medium.min}
                    max={fontSizeConfig.medium.max}
                    step={0.1}
                />

                <DimensionControl
                    id="font-size-large"
                    label="큰 글자 크기 (mm)"
                    value={fontSize.large}
                    onChange={value => onFontSizeChange('large', value)}
                    min={fontSizeConfig.large.min}
                    max={fontSizeConfig.large.max}
                    step={0.1}
                />
            </div>
        </div>
    );
}
