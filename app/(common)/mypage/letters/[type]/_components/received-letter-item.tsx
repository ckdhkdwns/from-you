'use client';

import Link from 'next/link';
import { ChevronRight } from 'react-feather';
import ImageWithFallback from '@/components/image-with-fallback';
import { compactParseDate } from '@/lib/date';
import { ReceivedLetterPublic } from '@/models/types/received-letter';

interface ReceivedLetterItemProps {
    letter: ReceivedLetterPublic;
}

export default function ReceivedLetterItem({ letter }: ReceivedLetterItemProps) {
    const href = `/mypage/letters/received/${letter?.SK.replace('RECEIVED_LETTER#', '')}`;

    return (
        <div className="w-full border-b border-t border-b-gray-100 border-t-primary-black">
            <div className="flex items-center justify-between mb-2 bg-gray-100 py-4 px-6 pr-4">
                <div className="text-sm font-medium">{compactParseDate(letter.createdAt)}</div>

                <div className="flex items-center justify-end gap-2">
                    <Link href={href} className="text-gray-450 text-sm flex items-center gap-1">
                        <div className="flex items-center gap-2 text-sm font-medium">상세보기</div>
                        <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
                    </Link>
                </div>
            </div>

            <Link href={href} className="flex gap-10 px-4 py-4">
                <div className="flex py-1">
                    {letter.photos && letter.photos.length > 0 && (
                        <ImageWithFallback
                            src={letter.photos[0].url}
                            alt="thumbnail"
                            width={100}
                            height={100}
                            className="object-cover w-[100px] h-[100px] rounded-sm"
                        />
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="font-semibold">{letter.senderName || '알 수 없음'}</h3>
                    {letter.photos && (
                        <div className="text-sm font-normal text-gray-500">
                            {letter.photos.length}장
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
}
