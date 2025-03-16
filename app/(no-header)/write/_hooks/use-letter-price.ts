'use client';

import { useEffect, useState } from 'react';
import { TemplatePublic } from '@/models/types/template';
import { getPostTypePrice } from '@/constants';

interface LetterPrice {
    photoPrice: number;
    paperPrice: number;
    postTypePrice: number;
    initialPrice: number;
    totalPrice: number;
    applyUsePoint: (_amount: number) => void;
}

export default function useLetterPrice({
    template,
    paperCount,
    photoCount,
    postType,
}: {
    template: TemplatePublic;
    paperCount: number;
    photoCount: number;
    postType: string;
}): LetterPrice {
    const [prices, setPrices] = useState({
        photoPrice: 0,
        paperPrice: 0,
        postTypePrice: 0,
        initialPrice: 0,
        totalPrice: 0,
    });

    const [usePoint, setUsePoint] = useState(0);

    useEffect(() => {
        if (!template || !postType) return;
        calculateLetterPrice();
    }, [template, paperCount, photoCount, postType, usePoint]);

    const calculateLetterPrice = () => {
        const initialPrice = template.discountedPrice;
        const paperPrice =
            Math.max(paperCount - template.initialQuantity.paper, 0) *
            template.additionalUnitPrice.paper;

        const photoPrice =
            Math.max(photoCount - template.initialQuantity.photo, 0) *
            template.additionalUnitPrice.photo;

        const postTypePrice = getPostTypePrice(postType);

        setPrices({
            paperPrice,
            photoPrice,
            postTypePrice,
            initialPrice,
            totalPrice: initialPrice + paperPrice + photoPrice + postTypePrice - usePoint,
        });
    };

    const applyUsePoint = (amount: number) => {
        setUsePoint(amount);
    };

    if (!template || !postType)
        return {
            photoPrice: 0,
            paperPrice: 0,
            postTypePrice: 0,
            initialPrice: 0,
            totalPrice: 0,
            applyUsePoint: () => {},
        };

    return { ...prices, applyUsePoint };
}
