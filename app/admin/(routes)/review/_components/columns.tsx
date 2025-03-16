'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ReviewPublic } from '@/models/types/review';
import { parseDateToRelative } from '@/lib/date';

import RatingStar from '@/app/(common)/templates/[id]/_components/rating';
import { Button } from '@/components/ui/button';
import { StarIcon } from 'lucide-react';

export const Columns = () => {
    const columns: ColumnDef<ReviewPublic>[] = [
        {
            accessorKey: 'template',
            header: '편지지명',
            cell: ({ row }) => {
                const templateName = row.getValue('template') as {
                    name: string;
                };
                return templateName?.name || '';
            },
        },
        {
            accessorKey: 'rating',
            header: '별점',
            cell: ({ row }) => {
                const rating = row.getValue('rating');
                return (
                    <div className="w-fit flex items-center justify-center mx-auto">
                        <RatingStar rating={rating as number} />
                    </div>
                );
            },
        },
        {
            accessorKey: 'content',
            header: '내용',
            cell: ({ row }) => {
                const content = row.getValue('content') as string;
                return content ? content.slice(0, 10) + '...' : '';
            },
        },
        {
            accessorKey: 'createdAt',
            header: '작성일시',
            cell: ({ row }) => {
                const createdAt = row.getValue('createdAt') as string;
                return (
                    <div className="flex items-center justify-center">
                        {createdAt ? parseDateToRelative(createdAt) : ''}
                    </div>
                );
            },
        },
        {
            accessorKey: 'isBest',
            header: '베스트',
            cell: ({ row }) => {
                const isBest = row.getValue('isBest') as boolean;

                return (
                    <Button
                        variant={isBest ? 'default' : 'outline'}
                        size="sm"
                        className={`flex items-center gap-1 ${
                            isBest ? 'bg-yellow-500 hover:bg-yellow-600' : ''
                        }`}
                        // onClick={() => toggleBestReview(reviewId, !isBest)}
                    >
                        {isBest && <StarIcon className="h-3 w-3" />}
                        {isBest ? '베스트' : '일반'}
                    </Button>
                );
            },
        },
    ];

    return columns;
};

export const columns = Columns();
