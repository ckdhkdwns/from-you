'use client';

import React from 'react';
import { useLetter } from '../../_contexts/letter-provider';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { POST_TYPES } from '@/constants';

export default function PostTypeSelection() {
    const { postTypes: selectedPostType, setPostTypes } = useLetter();
    const isMobile = useIsMobile();

    const handlePostTypeChange = (value: string) => {
        setPostTypes(value);
    };

    return (
        <div className="space-y-6 flex flex-col items-center w-full my-auto h-full">
            <RadioGroup
                value={selectedPostType}
                onValueChange={handlePostTypeChange}
                className={cn(
                    'flex gap-4 overflow-x-auto pb-4 px-6 md:px-1 w-full my-auto',
                    isMobile ? 'snap-x snap-mandatory' : 'justify-center',
                )}
            >
                {POST_TYPES.map(item => (
                    <div
                        key={item.value}
                        className={cn(
                            'relative',
                            isMobile
                                ? 'flex-none w-[65vw] max-w-[280px] snap-center'
                                : 'flex-none w-[238px]',
                        )}
                    >
                        <RadioGroupItem
                            value={item.value}
                            id={`post-type-${item.value}`}
                            className="sr-only"
                        />
                        <Label htmlFor={`post-type-${item.value}`} className="cursor-pointer block">
                            <Card
                                className={cn(
                                    'relative transition-all duration-300 rounded-[10px] bg-white',
                                    isMobile ? 'h-auto min-h-[320px]' : 'h-[360px]',
                                    selectedPostType === item.value
                                        ? 'border border-secondary-newpink shadow-lg'
                                        : 'border border-[#e7f0e0] hover:border-secondary-newpink hover:shadow-md',
                                )}
                            >
                                {selectedPostType === item.value && (
                                    <div className="absolute top-3 right-3">
                                        <div className="bg-secondary-newpink text-white px-3 py-1 rounded-full text-sm font-medium">
                                            선택됨
                                        </div>
                                    </div>
                                )}
                                <CardContent className={cn('p-0', isMobile ? 'pb-4' : '')}>
                                    <div className="flex flex-col items-start p-4 h-full">
                                        <div className="mb-4 space-y-2">
                                            <div
                                                className="flex items-center justify-center h-[26px] w-fit px-4 py-1 rounded-[100px] border "
                                                style={{
                                                    borderColor: POST_TYPES.find(
                                                        type => type.value === item.value,
                                                    )?.color,
                                                }}
                                            >
                                                <p className="flex-grow-0 flex-shrink-0 text-xs text-left text-[#333]">
                                                    {item.value === '79' ? '준등기' : item.label}
                                                </p>
                                            </div>
                                            <div className="mt-0.5">
                                                <p className="text-lg font-medium text-left text-[#333]">
                                                    {item.label}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 mb-4">
                                            <p className="text-[22px] font-semibold text-left text-[#333]">
                                                {item.price.toLocaleString()}원
                                            </p>
                                        </div>

                                        <div className="space-y-3 w-full">
                                            <div className="flex items-start gap-1.5">
                                                <svg
                                                    width={24}
                                                    height={24}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-6 h-6 flex-shrink-0"
                                                >
                                                    <path
                                                        d="M19.045 7L10.045 16L5.9541 11.9091"
                                                        stroke="#F57C7C"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <div className="space-y-2">
                                                    <p className="text-xs font-medium text-left text-[#333]">
                                                        영업일 기준 {item.delivery}
                                                    </p>
                                                    <p className="text-xs font-medium text-left text-[#333]">
                                                        제주 및 도서 지역은 약 2일 추가 소요
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <svg
                                                    width={24}
                                                    height={24}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-6 h-6 flex-shrink-0"
                                                >
                                                    <path
                                                        d="M19.045 7L10.045 16L5.9541 11.9091"
                                                        stroke="#F57C7C"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <p className="text-xs font-medium text-left text-[#333]">
                                                    우편물 추적 {item.trackable ? '가능' : '불가능'}
                                                </p>
                                            </div>

                                            {item.value === '79' && (
                                                <div className="flex items-center gap-1.5">
                                                    <svg
                                                        width={24}
                                                        height={24}
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-6 h-6 flex-shrink-0"
                                                    >
                                                        <path
                                                            d="M19.045 7L10.045 16L5.9541 11.9091"
                                                            stroke="#F57C7C"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <p className="text-xs font-medium text-left text-[#333]">
                                                        등기 추적 가능
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Label>
                    </div>
                ))}
            </RadioGroup>
            {isMobile && (
                <div className="flex justify-center w-full">
                    <p className="text-xs text-gray-500">
                        ← 좌우로 스와이프하여 더 많은 옵션을 확인하세요 →
                    </p>
                </div>
            )}
        </div>
    );
}
