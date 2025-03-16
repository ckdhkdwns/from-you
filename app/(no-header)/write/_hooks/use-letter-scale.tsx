'use client';

import React, { useEffect, useState } from 'react';
import { mmToPx } from '@/lib/mmToPx';
import { TemplateConfigPublic } from '@/models/types/template-config';

const standardWidth = 120; // 기준 너비 (mm)
const standardGap = 40; // 편지지 간격 (px)

const tempPaddingX = 40;

export default function useLetterScale({
    templateConfig,
    relativeWidth,
}: {
    templateConfig: TemplateConfigPublic;
    relativeWidth?: number;
}) {
    const [containerWidth, setContainerWidth] = useState(0);
    const [scale, setScale] = useState(1);
    const [scaledGap, setScaledGap] = useState(standardGap);

    const pxWidth = mmToPx(standardWidth);

    const calculateScale = () => {
        if (typeof window === 'undefined') return;

        const letterMaxWidth = 600;
        const containerWidth =
            Math.min(letterMaxWidth, relativeWidth || window.innerWidth) - tempPaddingX * 2;

        setContainerWidth(containerWidth);
        const newScale = Math.floor((containerWidth / pxWidth) * 100) / 100;

        console.log('scale', newScale);
        setScale(newScale);
    };

    const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setScale(Number(e.target.value));
    };

    useEffect(() => {
        calculateScale(); // 초기 로드 시 스케일 계산

        window.addEventListener('resize', calculateScale);
        return () => window.removeEventListener('resize', calculateScale);
    }, [relativeWidth]);

    useEffect(() => {
        if (!templateConfig || templateConfig?.paperSize?.width === 0) return;

        console.log('templateConfig', templateConfig);
        const scaledGap =
            standardGap +
            (containerWidth - pxWidth) *
                (templateConfig.paperSize.height / templateConfig.paperSize.width);

        console.log('scaledGap', scaledGap);
        setScaledGap(scaledGap);
    }, [scale, templateConfig, containerWidth, relativeWidth]);

    return { letterScale: scale, handleScaleChange, scaledGap };
}
