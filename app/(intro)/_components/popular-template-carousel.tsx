'use client';

import React, { useEffect, useState } from 'react';
import TemplateCard from '../../(common)/_components/template-card';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TemplatePublic } from '@/models/types/template';

export default function PopularTemplateCarousel({
    popularTemplates,
}: {
    popularTemplates: TemplatePublic[];
}) {
    const [minItems, setMinItems] = useState(4);
    const isMobile = useIsMobile();

    // 현재 화면 크기에 따라 필요한 최소 아이템 수 계산
    const getMinItems = () => {
        const width = typeof window !== 'undefined' ? window.innerWidth : 0;
        if (width >= 1280) return 4;
        if (width >= 1024) return 4;
        if (width >= 768) return 2;
        return 1;
    };

    useEffect(() => {
        setMinItems(getMinItems());
    }, []);

    const hasEnoughItems = popularTemplates.length > minItems;

    return (
        <div className="w-full flex flex-col gap-6 md:px-6">
            <div
                className={cn(
                    'flex items-end gap-2 pl-4 md:pl-0',
                    hasEnoughItems && !isMobile ? 'w-[calc(100%-16rem)] ml-24' : 'w-full',
                )}
            >
                <p className="text-2xl md:text-[1.75rem] font-bold text-left text-primary-black/90">
                    오늘의 편지지
                </p>
                <p className="text-base text-left text-gray-400">오늘의 편지지를 확인해보세요.</p>
            </div>
            <Carousel
                className={cn('w-full mx-auto', hasEnoughItems ? 'md:w-[calc(100%-12rem)]' : '')}
                opts={{ loop: hasEnoughItems }}
            >
                <CarouselContent>
                    {popularTemplates.map((template, index) => (
                        <CarouselItem
                            key={index}
                            className="max-md:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4 2xl:basis-1/4"
                        >
                            <TemplateCard template={template} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {hasEnoughItems && (
                    <>
                        <CarouselPrevious />
                        <CarouselNext />
                    </>
                )}
            </Carousel>
        </div>
    );
}
