import React from 'react';
import Image from 'next/image';

import { Separator } from '@/components/ui/separator';
import { PointInfo, PriceInfo } from '@/models/types/letter';
import { paymentMethodConfig, TRANSFER_ACCOUNT } from '@/constants';

export default function Receipt({
    priceInfo,
    pointInfo,
    paymentMethod,
    paymentStatus,
}: {
    priceInfo: PriceInfo;
    pointInfo: PointInfo;
    paymentMethod: string;
    paymentStatus: string;
}) {
    const totalPrice =
        priceInfo.initialPrice +
        priceInfo.postTypePrice +
        priceInfo.paperPrice +
        priceInfo.photoPrice;

    const priceItems = [
        { label: '상품금액', value: priceInfo.initialPrice },
        { label: '우편비', value: priceInfo.postTypePrice },
        { label: '추가 편지지 가격', value: priceInfo.paperPrice },
        { label: '사진 가격', value: priceInfo.photoPrice },
    ];

    return (
        <div className="flex flex-col md:flex-row justify-start items-start relative gap-6">
            <div className="flex flex-col justify-start items-start gap-4 w-full">
                <div className="flex justify-between items-center w-full relative">
                    <p className="text-base font-medium text-left text-[#4f4f4f]">총 주문금액</p>
                    <p className="text-lg font-semibold text-left text-gray-700">
                        {totalPrice?.toLocaleString()}원
                    </p>
                </div>
                <div className="flex flex-col justify-start items-start w-full gap-2">
                    {priceItems.map(
                        (item, index) =>
                            item.value > 0 && (
                                <div
                                    key={index}
                                    className="flex justify-between items-center self-stretch relative w-full"
                                >
                                    <p className="text-sm text-left text-gray-500">{item.label}</p>
                                    <p className="text-sm font-medium text-left text-gray-600">
                                        {item.value?.toLocaleString()}원
                                    </p>
                                </div>
                            ),
                    )}
                </div>
            </div>
            <Image
                src="/icons/receipt-minus.svg"
                alt="receipt-minus"
                width={28}
                height={28}
                className="hidden md:block "
            />
            <Separator className="block md:hidden my-2 bg-gray-200" />

            <div className="flex justify-between items-center w-full relative">
                <p className="text-base font-medium text-left text-[#4f4f4f]">할인금액</p>
                <p className="text-lg font-semibold text-left text-gray-700">
                    {pointInfo?.usePointAmount?.toLocaleString()}원
                </p>
            </div>
            <Image
                src="/icons/receipt-plus.svg"
                alt="receipt-plus"
                width={28}
                height={28}
                className="hidden md:block "
            />
            <Separator className="block md:hidden my-2 bg-gray-200" />
            <div className="flex flex-col justify-start items-start w-full gap-4">
                <div className="flex justify-between items-center self-stretch relative w-full">
                    <p className="text-base font-medium text-left text-[#4f4f4f]">총 결제금액</p>
                    <p className="text-lg font-semibold text-left text-gray-700">
                        {priceInfo.totalPrice?.toLocaleString()}원
                    </p>
                </div>
                <div className="flex justify-start items-start self-stretch gap-4 mt-1">
                    <div className="flex flex-col justify-center items-start relative gap-2">
                        <p className="text-sm font-medium text-left text-gray-500">
                            {paymentMethodConfig[paymentMethod].label}
                        </p>
                        {paymentMethod === 'transfer' && paymentStatus === 'pending' && (
                            <p className="text-sm font-medium text-left">
                                <span className="text-sm font-medium text-left text-gray-500">
                                    계좌번호:
                                </span>
                                <span className="text-sm font-medium text-left text-gray-600 ml-1">
                                    {TRANSFER_ACCOUNT.bankName}
                                    {TRANSFER_ACCOUNT.accountNumber}
                                </span>
                            </p>
                        )}
                        {paymentMethod === 'transfer' && paymentStatus === 'pending' && (
                            <p className="text-sm text-left">
                                <span className="text-sm font-semibold text-left text-gray-600">
                                    {TRANSFER_ACCOUNT.expiryDate}
                                </span>
                                <span className="text-sm font-medium text-left text-[#4f4f4f] ml-1">
                                    까지 미입금시 주문이 자동취소됩니다.
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
