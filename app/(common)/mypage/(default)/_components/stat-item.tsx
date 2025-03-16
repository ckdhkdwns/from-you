/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React from 'react';
import UnderlineText from './underline-text';

export default function StatItem({
    stat,
    index,
    stats,
}: {
    stat: any;
    index: number;
    stats: any[];
}) {
    const router = useRouter();
    return (
        <div
            className={cn('w-full flex items-center', stat.href && 'cursor-pointer')}
            onClick={() => {
                if (stat.href) {
                    router.push(stat.href);
                }
            }}
        >
            <div className="flex flex-col items-center justify-center w-full">
                <div className="mb-2.5">{stat.icon}</div>
                <div className="text-lg font-bold mb-1 relative">
                    <UnderlineText hidden={!stat.underline} length="120%">
                        {stat.value}
                    </UnderlineText>
                </div>
                <div className="text-sm text-gray-400 font-normal">{stat.label}</div>
                {stat.description && (
                    <div className="text-xs text-gray-400 mt-0">{stat.description}</div>
                )}
            </div>
            {index !== stats.length - 1 && <div className="w-[1.5px] h-11 bg-gray-200"></div>}
        </div>
    );
}
