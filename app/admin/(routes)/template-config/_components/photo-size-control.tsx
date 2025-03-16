'use client';

import React from 'react';
import DimensionControl from './dimension-control';

interface PhotoSize {
    width: number;
    height: number;
}

interface PhotoSizeControlProps {
    photoSize: PhotoSize;
    onPhotoSizeChange: (_dimension: 'width' | 'height', _value: number) => void;
}

export default function PhotoSizeControl({ photoSize, onPhotoSizeChange }: PhotoSizeControlProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
                <DimensionControl
                    id="photo-width"
                    label="사진 너비 (mm)"
                    value={photoSize?.width}
                    onChange={value => onPhotoSizeChange('width', value)}
                    min={10}
                    max={300}
                />

                <DimensionControl
                    id="photo-height"
                    label="사진 높이 (mm)"
                    value={photoSize?.height}
                    onChange={value => onPhotoSizeChange('height', value)}
                    min={10}
                    max={300}
                />
            </div>
        </div>
    );
}
