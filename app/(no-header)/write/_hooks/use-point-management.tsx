'use client';

import { POINT_RATE } from '@/constants';
import { useState, useEffect } from 'react';

interface PointManagementProps {
    totalPrice: number;
    paymentMethod: string;
    tossPaymentMethod: string | null;
    applyUsePoint: (_amount: number) => void;
}

interface PointManagement {
    isUsingPoint: boolean;
    usePointAmount: number;
    earnPointAmount: number;
    setIsUsingPoint: (_use: boolean) => void;
    setUsePointAmount: (_amount: number) => void;
    applyPoint: (_amount: number) => void;
    resetPoint: () => void;
    useAllPoint: (_availablePoint: number) => void;
}

export default function usePointManagement({
    totalPrice,
    paymentMethod,
    tossPaymentMethod,
    applyUsePoint,
}: PointManagementProps): PointManagement {
    const [isUsingPoint, setIsUsingPoint] = useState(false);
    const [usePointAmount, setUsePointAmount] = useState(0);
    const [earnPointAmount, setEarnPointAmount] = useState(0);

    // 적립 포인트 계산
    useEffect(() => {
        // 포인트 사용 시 적립 없음 (정책에 따라 변경 가능)
        if (isUsingPoint) {
            setEarnPointAmount(0);
            return;
        }

        // 결제 수단에 따른 포인트 적립률 계산
        let pointRate = 0;

        if (paymentMethod === 'toss' && tossPaymentMethod) {
            // 토스페이먼츠의 경우 선택된 결제 수단에 따라 적립률 적용
            // 토스페이먼츠는 대문자로 결제 수단 정보가 전달됨
            const rateInfo = POINT_RATE[tossPaymentMethod] || POINT_RATE.default;
            if (rateInfo.type === 'percent') {
                pointRate = rateInfo.rate;
            }
        } else {
            // 계좌이체 등 다른 결제 수단 (소문자로 처리)
            const rateInfo = POINT_RATE[paymentMethod.toLowerCase()] || POINT_RATE.default;
            if (rateInfo.type === 'percent') {
                pointRate = rateInfo.rate;
            }
        }

        // 적립 포인트 계산 (소수점 이하 버림)
        const calculatedPoints = Math.floor(totalPrice * pointRate);
        setEarnPointAmount(calculatedPoints);
    }, [paymentMethod, tossPaymentMethod, totalPrice, isUsingPoint]);

    // 포인트 적용
    const applyPoint = (amount: number) => {
        if (amount <= 0) {
            resetPoint();
            return;
        }

        setIsUsingPoint(true);
        setUsePointAmount(amount);
        applyUsePoint(amount);
    };

    // 포인트 초기화
    const resetPoint = () => {
        setIsUsingPoint(false);
        setUsePointAmount(0);
        applyUsePoint(0);
    };

    // 전액 사용
    const useAllPoint = (availablePoint: number) => {
        if (availablePoint <= 0) return;

        const pointToUse = Math.min(availablePoint, totalPrice);
        setIsUsingPoint(true);
        setUsePointAmount(pointToUse);
        applyUsePoint(pointToUse);
    };

    return {
        isUsingPoint,
        usePointAmount,
        earnPointAmount,
        setIsUsingPoint,
        setUsePointAmount,
        applyPoint,
        resetPoint,
        useAllPoint,
    };
}
