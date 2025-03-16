import React from 'react';
import AddressTypeTabs from './_components/address-type-tabs';
import { notFound } from 'next/navigation';

export default async function layout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ addressType: string }>;
}) {
    const { addressType } = await params;

    if (!['recipient', 'sender'].includes(addressType)) {
        return notFound();
    }

    return (
        <div className="space-y-2 pt-12">
            <div className="text-xl font-semibold mb-6">주소 관리</div>
            <AddressTypeTabs addressType={addressType as 'recipient' | 'sender'} />
            {children}
        </div>
    );
}
