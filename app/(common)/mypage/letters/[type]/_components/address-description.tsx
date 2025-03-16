import { AddressPublic } from '@/models/types/address';
import React from 'react';

export default function AddressDescription({
    address,
    type,
}: {
    address: AddressPublic;
    type: 'sender' | 'recipient';
}) {
    const label = type === 'sender' ? '주문자' : '수신자';

    const items = [
        { label: label, value: address.name },
        { label: '주소', value: `${address.zonecode} ${address.address1}` },
        { label: '상세주소', value: address.address2 },
        { label: '휴대폰', value: address.phone, hide: !address.phone },
        { label: '연락처', value: address.contact, hide: !address.contact },
    ];

    return (
        <div className="flex flex-col justify-start items-start relative gap-[18px]">
            <p className="self-stretch flex-grow-0 flex-shrink-0 w-[147px] text-base font-semibold text-left text-[#333]">
                {label} 정보
            </p>
            <div className="flex flex-col justify-start items-start gap-3">
                {items.map((item, index) => {
                    if (item.hide) return null;
                    return (
                        <div key={index} className="flex justify-start items-center gap-3">
                            <p className="text-sm text-left text-[#8c8c8c]">{item.label}</p>
                            <p className="text-sm font-medium text-left text-[#333]">
                                {item.value}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
