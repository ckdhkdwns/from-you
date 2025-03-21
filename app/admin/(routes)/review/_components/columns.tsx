'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EllipsisVertical, Star } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ReviewPublic } from '@/models/types/review';
import { useAdminReview } from '../_contexts/review-provider';
import { useConfirm } from '@/contexts/confirm-provider';
import { removeTableKeyPrefix } from '@/lib/api-utils';

export const columns: ColumnDef<ReviewPublic>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() || 
                    (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="모두 선택"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="선택"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'isBest',
        header: '베스트',
        cell: ({ row }) => {
            const isBest = row.getValue('isBest');
            return isBest ? (
                <Badge className="bg-yellow-500">
                    <Star className="w-3 h-3 mr-1" />
                    베스트
                </Badge>
            ) : null;
        },
    },
    {
        accessorKey: 'rating',
        header: '평점',
        cell: ({ row }) => {
            const rating = parseInt(row.getValue('rating') as string, 10);
            return <div>{rating}점</div>;
        },
    },
    {
        accessorKey: 'content',
        header: '내용',
        cell: ({ row }) => {
            const value = row.getValue('content') as string;
            return <div className="truncate max-w-[400px]">{value}</div>;
        },
    },
    {
        accessorKey: 'uploadUrls',
        header: '이미지',
        cell: ({ row }) => {
            const uploadUrls = row.getValue('uploadUrls') as string[];
            return uploadUrls && uploadUrls.length > 0 ? (
                <div className="flex space-x-1">
                    {uploadUrls.slice(0, 3).map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`리뷰 이미지 ${index + 1}`}
                            className="w-10 h-10 object-cover rounded"
                        />
                    ))}
                    {uploadUrls.length > 3 && <span className="text-sm text-muted-foreground">+{uploadUrls.length - 3}장</span>}
                </div>
            ) : (
                <span className="text-sm text-muted-foreground">없음</span>
            );
        },
    },
    {
        accessorKey: 'userName',
        header: '작성자',
        cell: ({ row }) => row.getValue('userName'),
    },
    {
        accessorKey: 'createdAt',
        header: '등록일',
        cell: ({ row }) => {
            const date = new Date(row.getValue('createdAt') as string);
            return format(date, 'yyyy-MM-dd');
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const review = row.original;
            const { deleteReview, toggleBestReview } = useAdminReview();
            const { confirm } = useConfirm();
            const reviewId = removeTableKeyPrefix(review.SK);

            const handleDeleteReview = async () => {
                const result = await confirm({
                    title: '리뷰 삭제',
                    description: '이 리뷰를 삭제하시겠습니까?',
                    className: 'bg-white',
                });

                if (result) {
                    await deleteReview(reviewId);
                }
            };

            const handleToggleBest = async () => {
                const isBest = !!review.isBest;
                const action = isBest ? '베스트 해제' : '베스트 등록';
                
                const result = await confirm({
                    title: `리뷰 ${action}`,
                    description: `이 리뷰를 ${action}하시겠습니까?` + 
                        (!isBest ? '\n회원에게 포인트 3000점이 지급됩니다.' : ''),
                    className: 'bg-white',
                });

                if (result) {
                    await toggleBestReview(reviewId, !isBest);
                }
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">메뉴 열기</span>
                            <EllipsisVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleToggleBest}>
                            {review.isBest ? '베스트 해제' : '베스트 등록'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDeleteReview}>삭제</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
