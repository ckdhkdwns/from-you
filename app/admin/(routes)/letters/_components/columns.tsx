'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PaymentMethod, ShippingStatus, LetterPublic } from '@/models/types/letter';
import { parseDateToRelative } from '@/lib/date';

import PaymentMethodBadge from '@/components/ui/payment-method-badge';
import StatusBadge from '@/components/ui/status-badge';
import { postTypeMapping } from '@/constants';

export const columns: ColumnDef<LetterPublic>[] = [
    {
        accessorKey: 'orderId',
        header: '주문번호',
    },
    {
        accessorKey: 'priceInfo',
        header: '결제금액',

        cell: ({ row }) => {
            const price = row.original.priceInfo.totalPrice;
            return price?.toLocaleString() + '원';
        },
    },
    {
        accessorKey: 'postType',
        header: '편지유형',
        cell: ({ row }) => {
            const postType = row.getValue('postType');
            return postTypeMapping[postType as keyof typeof postTypeMapping] || '';
        },
    },
    {
        accessorKey: 'paymentMethod',
        header: '결제방식',
        cell: ({ row }) => {
            const paymentMethod = row.getValue('paymentMethod') as PaymentMethod;
            return <PaymentMethodBadge paymentMethod={paymentMethod} />;
        },
    },
    {
        accessorKey: 'paymentStatus',
        header: '결제상태',
        cell: ({ row }) => {
            const paymentStatus = row.getValue('paymentStatus');
            return <StatusBadge status={paymentStatus as 'pending' | 'complete' | 'failed'} />;
        },
    },
    {
        accessorKey: 'shippingStatus',
        header: '배송상태',
        cell: ({ row }) => {
            const shippingStatus = row.getValue('shippingStatus') as ShippingStatus;
            return (
                <StatusBadge
                    status={shippingStatus as 'pending' | 'shipping' | 'complete' | 'failed'}
                />
            );
        },
    },
    {
        accessorKey: 'updatedAt',
        header: '등록 일시',
        cell: ({ row }) => {
            const { paymentMethod, transferRequestedAt, paymentCompletedAt } = row.original;
            const updatedAt =
                paymentMethod === 'transfer' ? transferRequestedAt : paymentCompletedAt;

            return (
                <div className="flex items-center justify-center">
                    {updatedAt ? parseDateToRelative(updatedAt) : ''}
                </div>
            );
        },
    },
];
