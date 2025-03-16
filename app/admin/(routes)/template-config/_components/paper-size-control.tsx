'use client';

import React from 'react';
import DimensionControl from './dimension-control';

interface PaperSize {
    width: number;
    height: number;
}

interface PaperSizeControlProps {
    paperSize: PaperSize;
    onPaperSizeChange: (_dimension: 'width' | 'height', _value: number) => void;
    onPaperPreset?: (_preset: string) => void;
}

export default function PaperSizeControl({ paperSize, onPaperSizeChange }: PaperSizeControlProps) {
    return (
        <div className="space-y-4">
            {/* {onPaperPreset && (
        <div className="flex flex-wrap gap-2 mb-4">
          {PAPER_PRESETS.map((preset) => (
            <Button
              key={preset.value}
              variant="outline"
              size="sm"
              onClick={() => onPaperPreset(preset.value)}
            >
              {preset.name} ({preset.width}×{preset.height})
            </Button>
          ))}
        </div>
      )} */}

            <div className="grid grid-cols-2 gap-6">
                <DimensionControl
                    id="width"
                    label="너비 (mm)"
                    value={paperSize.width}
                    onChange={value => onPaperSizeChange('width', value)}
                    min={50}
                    max={500}
                />

                <DimensionControl
                    id="height"
                    label="높이 (mm)"
                    value={paperSize.height}
                    onChange={value => onPaperSizeChange('height', value)}
                    min={50}
                    max={500}
                />
            </div>
        </div>
    );
}
