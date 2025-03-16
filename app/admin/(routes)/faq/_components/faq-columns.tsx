'use client';

import { ColumnDef } from '@tanstack/react-table';
import { FaqPublic } from '@/models/types/faq';
import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const columns: ColumnDef<FaqPublic>[] = [
    {
        accessorKey: 'order',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                순서
            </Button>
        ),
        cell: ({ row }) => <div className="text-center">{row.getValue('order')}</div>,
    },
    {
        accessorKey: 'question',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                질문
            </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue('question')}</div>,
    },
    {
        accessorKey: 'category',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                카테고리
            </Button>
        ),
        cell: ({ row }) => <div>{row.getValue('category')}</div>,
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
