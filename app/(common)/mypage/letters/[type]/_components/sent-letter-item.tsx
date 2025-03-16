'use client';

import Link from 'next/link';
import { ChevronRight, X } from 'react-feather';
import UnderlineText from '../../../(default)/_components/underline-text';
import ImageWithFallback from '@/components/image-with-fallback';
import { compactParseDate } from '@/lib/date';

import { getStatusText } from '../_libs/get-status-text';
import { LetterPublic } from '@/models/types/letter';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';

interface SentLetterItemProps {
    letter: LetterPublic;
    letterType: 'sent' | 'received' | 'draft';
    onDelete: (_id: string) => void;
    isDetail?: boolean;
    isPrepared?: boolean;
    onOpenReviewDialog?: (_letter: LetterPublic) => void;
}

export default function SentLetterItem({
    letter,
    letterType,
    onDelete,
    isDetail = false,
    onOpenReviewDialog,
    isPrepared = false,
}: SentLetterItemProps) {
    console.log(letterType);
    const templateId = removeTableKeyPrefix(letter?.template?.PK);
    const letterId = removeTableKeyPrefix(letter?.SK);
    const href = letter.isDraft
        ? `/write?tid=${templateId}&lid=${letterId}&from=mypage`
        : `/mypage/letters/${letterType}/${letterId}`;

    const getDisplayDate = () => {
        if (letter.isDraft) return letter.updatedAt;
        if (letter.paymentMethod === 'transfer') return letter.transferRequestedAt;
        if (letter.paymentMethod === 'point') return letter.paymentCompletedAt;
        return letter.paymentCompletedAt;
    };

    const displayDate = getDisplayDate();

    return (
        <div className="w-full border-b border-t border-b-gray-100 border-t-primary-black">
            <div className="flex items-center justify-between mb-2 bg-gray-100 py-4 px-6 pr-4">
                <div className="text-sm font-medium">{compactParseDate(displayDate)}</div>

                <div className="flex items-center justify-end gap-2">
                    {letter.isDraft && (
                        <>
                            <div
                                className="flex items-center gap-2 text-sm font-medium text-gray-450 cursor-pointer"
                                onClick={() => onDelete(letterId)}
                            >
                                삭제하기
                            </div>
                            <X className="text-gray-450 w-4 h-4" strokeWidth={2} />

                            <div className="w-[1px] h-4 bg-gray-200 mx-2" />
                        </>
                    )}
                    {!isPrepared && (
                        <Link href={href} className="text-gray-450 text-sm flex items-center gap-1">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                {letter.isDraft ? '이어서 작성하기' : '상세보기'}
                            </div>
                            <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
                        </Link>
                    )}
                    {isPrepared && (
                        <div
                            className="text-gray-450 text-sm flex items-center gap-1 cursor-pointer"
                            onClick={() => onOpenReviewDialog?.(letter)}
                        >
                            리뷰 쓰기
                            <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                    )}
                </div>
            </div>

            <Link href={href} className="flex gap-10 px-4 py-4">
                <div className="flex py-1">
                    {letter.template.thumbnail && (
                        <ImageWithFallback
                            src={letter.template.thumbnail}
                            alt="thumbnail"
                            width={100}
                            height={100}
                            className="object-cover w-[100px] h-[100px] rounded-sm"
                        />
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="font-semibold">{letter.template.name}</h3>
                    {letterType === 'sent' && (
                        <p className="text-sm font-normal text-gray-500">
                            {letter.priceInfo.totalPrice.toLocaleString()}원
                        </p>
                    )}

                    <div className="text-sm font-normal text-gray-500">
                        편지 {letter.text.length}장
                    </div>

                    <div className="text-sm font-normal text-gray-500">
                        사진 {letter.photos.length}장
                    </div>
                </div>
            </Link>
            {!letter.isDraft && (
                <div className="flex items-center gap-4 px-6 py-4 border-t border-b border-gray-100">
                    {!isDetail && (
                        <UnderlineText length="120%">
                            <span className="font-semibold">
                                {getStatusText({
                                    paymentStatus: letter.paymentStatus,
                                    shippingStatus: letter.shippingStatus,
                                })}
                            </span>
                        </UnderlineText>
                    )}
                </div>
            )}
        </div>
    );
}
