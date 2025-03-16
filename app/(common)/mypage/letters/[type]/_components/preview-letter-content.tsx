'use client';

import ReadonlyPaper from '@/components/papers/readonly-paper';

import React from 'react';

import useLetterScale from '@/app/(no-header)/write/_hooks/use-letter-scale';
import { useIsMobile } from '@/hooks/use-mobile';

import { LetterPublic } from '@/models/types/letter';
import { TemplateConfigPublic } from '@/models/types/template-config';

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
        relativeWidth: isMobile ? 300 : 500,
    });

    const mobileAdjust = isMobile ? 200 : 0;

    return (
        <div className="flex justify-center items-center my-4 w-full max-w-3xl overflow-x-auto">
            <div
                className="w-full"
                style={{
                    scrollSnapType: 'x mandatory',
                    display: 'flex',
                }}
            >
                {letter.text.map((t, index) => (
                    <div
                        key={index}
                        style={{
                            transform: `scale(${letterScale})`,
                            marginTop: -letterScale * mobileAdjust * 1.5,
                            marginBottom: -letterScale * mobileAdjust * 1.5,
                            marginLeft: -letterScale * mobileAdjust * 1.1,
                            marginRight: -letterScale * mobileAdjust * 1.1,
                            scrollSnapAlign: 'center',
                        }}
                    >
                        <ReadonlyPaper
                            text={t}
                            paperImage={paperImage}
                            config={templateConfig}
                            font={letter.font}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
