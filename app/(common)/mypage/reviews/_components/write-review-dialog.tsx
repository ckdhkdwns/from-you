'use client';

import React, { useMemo, useState } from 'react';
import { useReview } from '../_contexts/review-context';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import RatingStar from '@/app/(common)/templates/[id]/_components/rating';
import { Separator } from '@/components/ui/separator';

export default function WriteReviewDialog() {
    const { isReviewDialogOpen, closeReviewDialog, selectedLetter, submitReview } = useReview();
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        await submitReview({
            rating,
            content,
        });

        // 폼 초기화
        setRating(5);
        setContent('');
    };

    const earnPoint = useMemo(() => {
        return selectedLetter?.pointInfo.usePointAmount > 0
            ? 0
            : selectedLetter?.priceInfo.totalPrice * 0.01;
    }, [selectedLetter]);

    if (!selectedLetter) return null;

    return (
        <ResponsiveDialog
            open={isReviewDialogOpen}
            onOpenChange={open => !open && closeReviewDialog()}
            title="리뷰 작성"
            contentClassName="sm:max-w-[500px]"
        >
            <div className="border-t-[2px] border-t-primary-black border-b py-4 my-4">
                <div className="flex items-center gap-4">
                    <div className="w-[100px] h-[100px] relative">
                        {selectedLetter.template.thumbnail && (
                            <Image
                                src={selectedLetter.template.thumbnail}
                                alt="편지 썸네일"
                                fill
                                className="object-cover rounded-sm"
                            />
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-semibold">{selectedLetter.template.name}</h3>
                        <p className="text-sm text-gray-500">편지 {selectedLetter.text.length}장</p>
                        <p className="text-sm text-gray-500">
                            사진 {selectedLetter.photos.length}장
                        </p>
                        <p className="text-sm text-gray-500">일반 우편</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <p className="font-medium">편지는 어떠셨나요?</p>
                    <div className="flex items-center gap-2">
                        <RatingStar
                            rating={rating}
                            onClick={rating => setRating(rating)}
                            size={24}
                        />
                    </div>
                </div>
                <Separator />
                <div className="space-y-2">
                    <p className="font-medium">솔직한 후기를 남겨주세요!</p>
                    <Textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="후기를 작성해주세요."
                        className="min-h-[150px]"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        {earnPoint > 0 ? (
                            <>
                                <span className="font-medium">적립 예상 포인트</span>{' '}
                                <span className="text-secondary-newpink font-semibold">
                                    {earnPoint}P
                                </span>
                            </>
                        ) : (
                            <span className="font-medium text-xs">
                                구매할 때 포인트를 사용해 포인트를 지급받을 수 없습니다.
                            </span>
                        )}
                    </div>
                    <Button onClick={handleSubmit} disabled={rating === 0 || !content.trim()}>
                        리뷰 작성하기
                    </Button>
                </div>
            </div>
        </ResponsiveDialog>
    );
}
