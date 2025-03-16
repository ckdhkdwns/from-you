'use client';

import { ColumnDef } from '@tanstack/react-table';

import Image from 'next/image';
import { TemplatePublic } from '@/models/types/template';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<TemplatePublic>[] = [
    {
        accessorKey: 'thumbnail',
        header: '썸네일',
        cell: ({ row }) => {
            return (
                <Image
                    src={row.original.thumbnail}
                    alt="thumbnail"
                    width={80}
                    height={80}
                    className="rounded-md m-auto aspect-square object-cover"
                />
            );
        },
    },
    {
        accessorKey: 'name',
        header: '이름',
    },
    {
        accessorKey: 'initialPrice',
        header: '기본 가격',
        cell: ({ row }) => {
            const price = row.original.initialPrice;
            return `${price.toLocaleString()}원`;
        },
    },
    {
        accessorKey: 'discountedPrice',
        header: '할인 가격',
        cell: ({ row }) => {
            const price = row.original.discountedPrice;
            return `${price.toLocaleString()}원`;
        },
    },
    {
        accessorKey: 'isPopular',
        header: '상태',
        cell: ({ row }) => {
            const isPopular = row.original.isPopular;
            return (
                <Badge variant={isPopular ? 'default' : 'secondary'}>
                    {isPopular ? '인기' : '-'}
                </Badge>
            );
        },
    },

    // {
    //     accessorKey: "createdAt",
    //     header: "등록 일시",
    //     cell: ({ row }) => {
    //         const date = new Date(row.getValue("createdAt"));
    //         return parseDate(date);
    //     },
    // },
];
