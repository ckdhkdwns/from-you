'use client';

import { Photo } from '@/models/types/letter';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Printer } from 'react-feather';
import { useReactToPrint } from 'react-to-print';
import { createPrintStyle } from '../../_libs/print-style';
import { cmToPixel } from '../../_libs/cm-to-pixel';
import { TemplateConfigPublic } from '@/models/types/template-config';

const PhotoItem = ({
    photo,
    templateConfig,
}: {
    photo: Photo;
    templateConfig: TemplateConfigPublic | null;
}) => {
    const aspectRatio =
        (templateConfig?.photoSize?.width || 1) / (templateConfig?.photoSize?.height || 1);

    return (
        <div
            className="w-full h-full overflow-hidden"
            style={{
                aspectRatio: aspectRatio,
            }}
        >
            <img src={photo.url} alt={photo.id} className="w-full h-full object-cover" />
        </div>
    );
};

const PrintArea = forwardRef<HTMLDivElement, { photos: Photo[] }>(({ photos }, ref) => {
    return (
        <div ref={ref}>
            {photos.map(photo => (
                <div
                    className="overflow-hidden"
                    key={photo.id}
                    style={{
                        width: cmToPixel(12),
                        height: cmToPixel(16),
                    }}
                >
                    <img
                        src={photo.url}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </div>
            ))}
        </div>
    );
});

PrintArea.displayName = 'PrintArea';

export default function LetterPhotoSection({
    photos,
    templateConfig,
}: {
    photos: Photo[];
    templateConfig: TemplateConfigPublic | null;
}) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    const handlePrint = useReactToPrint({
        pageStyle: createPrintStyle(12, 16),
    });

    const reactToPrintContent = () => {
        return printRef.current;
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="flex items-center justify-between w-full mb-4   ">
                <h3 className="text-md font-semibold">편지 사진</h3>
                <Button
                    onClick={() => {
                        handlePrint(reactToPrintContent);
                    }}
                    size="sm"
                >
                    <Printer className="mr-2 h-4 w-4" />
                    사진 {count}장 출력하기
                </Button>
            </div>
            <Carousel className="w-full max-w-full" setApi={api => setApi(api)}>
                <CarouselContent>
                    {photos.map(photo => (
                        <CarouselItem key={photo.id} className="md:basis-1/1">
                            <div className="flex justify-center">
                                <div className="w-full max-w-md rounded-md overflow-hidden">
                                    <PhotoItem photo={photo} templateConfig={templateConfig} />
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
            </Carousel>

            <div className="flex items-center justify-center w-full mt-4">
                <div className="text-sm text-gray-500">
                    {current} / {count}
                </div>
            </div>

            <div className="hidden">
                <PrintArea ref={printRef} photos={photos} />
            </div>
        </div>
    );
}
