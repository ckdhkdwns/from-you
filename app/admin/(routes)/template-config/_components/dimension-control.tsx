'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface DimensionControlProps {
    id: string;
    label: string;
    value: number;
    onChange: (_value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
}

export default function DimensionControl({
    id,
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    unit = 'mm',
}: DimensionControlProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="flex items-center space-x-2">
                <Input
                    id={id}
                    type="number"
                    value={value}
                    onChange={e => onChange(Number(e.target.value))}
                    min={min}
                    max={max}
                    step={step}
                />
                <span>{unit}</span>
            </div>
            <Slider
                value={[value]}
                min={min}
                max={max}
                step={step}
                onValueChange={value => onChange(value[0])}
            />
        </div>
    );
}
