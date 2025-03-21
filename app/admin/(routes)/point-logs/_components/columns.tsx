'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PointLogPublic } from '@/models/types/point-log';
import { parseDateToRelative } from '@/lib/date';
import { POINT_CHANGE_REASON } from '@/constants/data/point-change-reason';
import { removeTableKeyPrefix } from '@/lib/api-utils';

export const columns: ColumnDef<PointLogPublic>[] = [
    {
        header: '사용자 ID',
        accessorKey: 'user',
        cell: ({ row }) => {
            return <div>{removeTableKeyPrefix(row.original?.user?.PK)}</div>;
        },
    },
    {
        header: '변경 포인트',
        accessorKey: 'changeAmount',
        cell: ({ row }) => {
            return (
                <div>
                    {row.original.changeAmount > 0
                        ? `+${row.original.changeAmount.toLocaleString()}`
                        : `${row.original.changeAmount.toLocaleString()}`}
                </div>
            );
        },
    },
    {
        header: '변경 이유',
        accessorKey: 'reason',
        cell: ({ row }) => {
            return <div>{POINT_CHANGE_REASON[row.original.reason].label}</div>;
        },
    },
    {
        header: '변경 일시',
        accessorKey: 'createdAt',
        cell: ({ row }) => {
            return <div>{parseDateToRelative(row.original.createdAt)}</div>;
        },
    },
];
