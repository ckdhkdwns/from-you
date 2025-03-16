'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { NoticePublic } from '@/models/types/notice';

export const columns: ColumnDef<NoticePublic>[] = [
    {
        accessorKey: 'title',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                제목
            </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue('title')}</div>,
    },
    {
        accessorKey: 'isPublished',
        header: '상태',
        cell: ({ row }) => {
            const isPublished = row.getValue('isPublished');
            return (
                <Badge variant={isPublished ? 'default' : 'outline'}>
                    {isPublished ? '공개' : '비공개'}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                등록일시
            </Button>
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue('createdAt'));
            return <div>{format(date, 'yyyy.MM.dd', { locale: ko })}</div>;
        },
    },
];
