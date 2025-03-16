'use client';

import { ColumnDef } from '@tanstack/react-table';
import { UserPublic } from '@/models/types/user';
import ProviderBadge from '@/components/ui/provider-badge';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<UserPublic>[] = [
    {
        accessorKey: 'name',
        header: '이름',
        enableSorting: true,
    },
    {
        accessorKey: 'PK',
        header: 'ID',
        enableSorting: true,
        size: 100,
        cell: ({ row }) => {
            const userId = row.getValue('PK') as string;
            return (
                <div className="text-ellipsis overflow-hidden">{userId.replace('USER#', '')}</div>
            );
        },
    },
    {
        accessorKey: 'provider',
        header: '가입 방법',
        enableSorting: true,
        cell: ({ row }) => {
            return <ProviderBadge provider={row.getValue('provider')} />;
        },
    },
    {
        accessorKey: 'point',
        header: '포인트',
        enableSorting: true,
        cell: ({ row }) => {
            return row.getValue('point').toLocaleString() + 'P';
        },
    },
    {
        accessorKey: 'createdAt',
        header: '가입일',
        enableSorting: true,
        cell: ({ row }) => {
            const date = new Date(row.getValue('createdAt'));
            return date.toLocaleDateString('ko-KR');
        },
    },
    {
        accessorKey: 'blocked',
        header: '상태',
        enableSorting: true,
        cell: ({ row }) => {
            return row.getValue('blocked') ? (
                <Badge variant="destructive">차단됨</Badge>
            ) : (
                <Badge variant="outline">-</Badge>
            );
        },
    },
    // {
    //   id: "actions",
    //   cell: ({ row }) => {
    //     const user = row.original

    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <MoreHorizontal className="h-4 w-4" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //           <DropdownMenuLabel>작업</DropdownMenuLabel>
    //           <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id!)}>
    //             ID 복사
    //           </DropdownMenuItem>
    //           <DropdownMenuItem>수정</DropdownMenuItem>
    //           <DropdownMenuItem className="text-red-600">삭제</DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     )
    //   },
    // },
];
