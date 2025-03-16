'use client';

import React from 'react';
import DimensionControl from './dimension-control';

interface Padding {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface PaddingControlProps {
    padding: Padding;
    onPaddingChange: (_side: 'top' | 'right' | 'bottom' | 'left', _value: number) => void;
    min?: number;
    max?: number;
}

export default function PaddingControl({
    padding,
    onPaddingChange,
    min = 0,
    max = 100,
}: PaddingControlProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
                <DimensionControl
                    id="padding-top"
                    label="상단 여백 (mm)"
                    value={padding.top}
                    onChange={value => onPaddingChange('top', value)}
                    min={min}
                    max={max}
                />

                <DimensionControl
                    id="padding-right"
                    label="우측 여백 (mm)"
                    value={padding.right}
                    onChange={value => onPaddingChange('right', value)}
                    min={min}
                    max={max}
                />

                <DimensionControl
                    id="padding-bottom"
                    label="하단 여백 (mm)"
                    value={padding.bottom}
                    onChange={value => onPaddingChange('bottom', value)}
                    min={min}
                    max={max}
                />

                <DimensionControl
                    id="padding-left"
                    label="좌측 여백 (mm)"
                    value={padding.left}
                    onChange={value => onPaddingChange('left', value)}
                    min={min}
                    max={max}
                />
            </div>
        </div>
    );
}
