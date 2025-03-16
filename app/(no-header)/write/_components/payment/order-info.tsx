import React from 'react';
import { useLetter } from '../../_contexts/letter-provider';
import { getPostTypeName } from '@/lib/letter-utils';
import Image from 'next/image';

// 정보 항목 컴포넌트
const InfoItem = ({ label, count, price }: { label: string; count: number; price: number }) => (
    <div className="flex gap-2 text-sm">
        <div className="text-gray-450 font-normal min-w-[70px]">
            {label} <span className="font-medium text-primary-black">{count}</span>장
        </div>
        <div className="text-gray-450 font-normal min-w-[70px]">
            <span className="font-medium text-primary-black">{price.toLocaleString()}</span>원
        </div>
    </div>
);

export default function OrderInfo() {
    const { template, text, photo, paperPrice, photoPrice, postTypePrice, postTypes } = useLetter();

    return (
        <div className="flex flex-col gap-2">
            <div className="text-lg font-semibold">주문정보</div>
            <div className="w-full h-[1px] bg-primary-black" />

            <div className="flex gap-10 py-4 pl-6">
                <div className="w-[100px] h-[100px]">
                    {template?.thumbnail && (
                        <Image
                            src={template?.thumbnail}
                            alt={template?.name}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <div className="font-medium">{template?.name}</div>
                    <div className="text-sm text-gray-450 font-normal">
                        {(template?.discountedPrice || 0).toLocaleString()}원
                    </div>
                    <InfoItem label="편지" count={text.length} price={paperPrice} />
                    <InfoItem label="사진" count={photo.length} price={photoPrice} />
                </div>
            </div>
            <div className="text-sm text-gray-450 font-normal border-y border-gray-200 py-4 flex">
                <div className="min-w-[100px]">{getPostTypeName(postTypes)}</div>{' '}
                <div className="font-medium text-primary-black">
                    {postTypePrice.toLocaleString()}
                </div>
                원
            </div>
        </div>
    );
}
