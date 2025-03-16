import { Photo } from '@/models/types/letter';
import React from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function PreviewPhoto({
    photos,
    aspectRatio,
}: {
    photos: Photo[];
    aspectRatio: number;
}) {
    if (!photos || photos.length === 0) {
        return null;
    }

    return (
        <div className="w-full">
            <Carousel className="w-full">
                <CarouselContent>
                    {photos.map(photo => (
                        <CarouselItem key={photo.id} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                                <div
                                    className="w-full flex relative rounded-md overflow-hidden"
                                    style={{ aspectRatio }}
                                >
                                    <Image
                                        src={photo.url}
                                        alt={photo.id}
                                        fill
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
            </Carousel>
        </div>
    );
}
