'use client';

import ImageWithFallback from '@/components/image-with-fallback';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function ImageSection({
    thumbnail,
    paperImage,
}: {
    thumbnail: string;
    paperImage: string;
}) {
    const [selectedImage, setSelectedImage] = useState<string>(thumbnail);

    return (
        <div className="flex flex-col gap-2">
            <div className="relative aspect-square bg-transparent rounded-sm overflow-hidden">
                <ImageWithFallback
                    src={selectedImage}
                    alt={'selectedImage'}
                    fill
                    className="object-cover "
                />
            </div>
            <div className="gap-2 hidden md:flex">
                <div
                    onClick={() => setSelectedImage(thumbnail)}
                    className={cn(
                        'relative w-1/4 aspect-square bg-transparent rounded-sm overflow-hidden cursor-pointer',
                        selectedImage === thumbnail ? 'border-2 border-primary-black' : '',
                    )}
                >
                    <ImageWithFallback
                        src={thumbnail}
                        alt={'thumbnail'}
                        fill
                        className="object-cover "
                    />
                </div>
                <div
                    onClick={() => setSelectedImage(paperImage)}
                    className={cn(
                        'relative w-1/4 aspect-square bg-transparent rounded-sm overflow-hidden cursor-pointer ',
                        selectedImage === paperImage ? 'border-2 border-primary-black' : '',
                    )}
                >
                    <ImageWithFallback
                        src={paperImage}
                        alt={'paperImage'}
                        fill
                        className="object-cover "
                    />
                </div>
            </div>
        </div>
    );
}
