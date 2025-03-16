'use client';

import ReadonlyPaper from '@/components/papers/readonly-paper';
import React from 'react';
import useLetterScale from '@/app/(no-header)/write/_hooks/use-letter-scale';
import { useIsMobile } from '@/hooks/use-mobile';
import { LetterPublic } from '@/models/types/letter';
import { TemplateConfigPublic } from '@/models/types/template-config';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

export default function PreviewLetterContent({
    letter,
    paperImage,
    templateConfig,
}: {
    letter: LetterPublic;
    paperImage: string;
    templateConfig: TemplateConfigPublic;
}) {
    const isMobile = useIsMobile();
    const { letterScale } = useLetterScale({
        templateConfig,
        relativeWidth: isMobile ? 350 : 500,
    });

    const mobileAdjust = isMobile ? 200 : 0;

    return (
        <div className="flex justify-center items-center my-4 w-full max-w-3xl">
            <Carousel className="w-full">
                <CarouselContent>
                    {letter.text.map((t, index) => (
                        <CarouselItem key={index}>
                            <div
                                className="flex justify-center"
                                style={{
                                    transform: `scale(${letterScale})`,
                                    marginTop: -letterScale * mobileAdjust * 1,
                                    marginBottom: -letterScale * mobileAdjust * 1,
                                    marginLeft: -letterScale * mobileAdjust * 1.1,
                                    marginRight: -letterScale * mobileAdjust * 1.1,
                                }}
                            >
                                <ReadonlyPaper
                                    text={t}
                                    paperImage={paperImage}
                                    config={templateConfig}
                                    font={letter.font}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className={isMobile ? 'left-0' : '-left-12'} />
                <CarouselNext className={isMobile ? 'right-0' : '-right-12'} />
            </Carousel>
        </div>
    );
}
