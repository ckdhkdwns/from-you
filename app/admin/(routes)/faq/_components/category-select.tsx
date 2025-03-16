'use client';

import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface CategorySelectProps {
    value: string;
    onChange: (_value: string) => void;
}

// FAQ 카테고리 목록 (필요에 따라 수정)
const CATEGORIES = [
    { value: '전체', label: '전체' },
    { value: '일반', label: '일반' },
    { value: '결제', label: '결제' },
    { value: '배송', label: '배송' },
    { value: '기타', label: '기타' },
];

export function CategorySelect({ value, onChange }: CategorySelectProps) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
                {CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                        {category.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
