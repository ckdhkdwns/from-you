import React from 'react';
import { useLetter } from '../../_contexts/letter-provider';

import { cn } from '@/lib/utils';
import { getPostTypeLabel } from '@/constants';

export default function PaymentInfo() {
    const {
        totalPrice,
        paperPrice,
        photoPrice,
        initialPrice,
        postTypes,
        postTypePrice,
        usePointAmount,
    } = useLetter();
    console.log(totalPrice);
    const items = [
        { label: '기본 편지지', value: initialPrice },
        { label: '추가 편지지', value: paperPrice, hide: !paperPrice },
        { label: '사진', value: photoPrice, hide: !photoPrice },
        { label: getPostTypeLabel(postTypes), value: postTypePrice },
        {
            label: '포인트 차감 금액',
            value: `- ${usePointAmount.toLocaleString()}`,
            hide: !usePointAmount,
        },
        { type: 'divider' },
        { label: '총 결제 금액', value: totalPrice, strong: true },
    ];

    return (
        <div className="flex flex-col gap-2">
            <div className="text-lg font-semibold">결제정보</div>
            <div className="w-full h-[1px] bg-primary-black" />
            <div className="flex flex-col gap-1 pt-4">
                {items.map((item, index) => {
                    if (item.type === 'divider') {
                        return (
                            <div
                                key={index}
                                className="w-[calc(100%-24px)] my-2 mx-auto h-[1px] bg-gray-200"
                            />
                        );
                    }
                    if (item.hide) {
                        return null;
                    }
                    return (
                        <div key={item.label} className="flex justify-between py-2 items-center">
                            <div
                                className={cn(
                                    'text-primary-black',
                                    item.strong ? 'font-semibold text-lg' : 'font-normal text-sm',
                                )}
                            >
                                {item.label}
                            </div>
                            <div
                                className={cn(
                                    'text-primary-black',
                                    item.strong ? 'font-semibold text-lg' : 'font-normal text-sm',
                                )}
                            >
                                {item.value?.toLocaleString()} 원
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
