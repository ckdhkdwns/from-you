import React from 'react';
import RatingStar from './rating';
import ImageWithFallback from '@/components/image-with-fallback';
import { ReviewPublic } from '@/models/types/review';

export default function ReviewItem({
    review,
    thumbnail,
}: {
    review: ReviewPublic;
    thumbnail: string;
}) {
    return (
        <div className="flex gap-3 border-b border-gray-100 pb-6">
            <div className="relative aspect-square bg-transparent rounded-sm overflow-hidden w-32 min-w-32  h-32 min-h-32 max-w-32 max-h-32">
                <ImageWithFallback
                    src={thumbnail}
                    alt={'thumbnail'}
                    fill
                    className="object-cover "
                />
            </div>
            <div className="flex flex-col gap-2 pt-2 pl-2">
                {/* <div>{review.template.name}</div> */}
                <div className="flex items-center gap-2">
                    <RatingStar rating={review.rating} />
                    <span className="text-xs text-gray-400 font-normal">
                        {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <p className="text-sm font-normal">{review.content}</p>
            </div>
        </div>
    );
}
