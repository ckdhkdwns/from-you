'use client';

import { TRANSFER_ACCOUNT } from '@/constants';
import React from 'react';

export default function AccountAlert() {
    const items = [
        {
            label: '은행명',
            value: TRANSFER_ACCOUNT.bankName,
        },
        {
            label: '계좌번호',
            value: TRANSFER_ACCOUNT.accountNumber,
        },
        {
            label: '예금주',
            value: TRANSFER_ACCOUNT.accountName,
        },
    ];
    return (
        <div>
            <h3 className="text-base font-bold mb-2 text-gray-800">입금 계좌 정보</h3>

            <div className="flex flex-col space-y-2">
                {items.map(item => (
                    <div className="flex items-center" key={item.label}>
                        <span className="w-20 text-sm font-medium text-gray-500">{item.label}</span>
                        <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                    </div>
                ))}
            </div>

            {/* <div className="mt-3 p-2 text-sm">
                <p className="text-secondary-newpink">
                    <span className="font-semibold">
                        {transferAccount.expiryDate}
                    </span>
                    <span className="ml-1">
                        까지 미입금시 주문이 자동취소됩니다.
                    </span>
                </p>
            </div> */}
        </div>
    );
}
