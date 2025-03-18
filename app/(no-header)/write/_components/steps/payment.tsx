'use client';

import React, { useState } from 'react';

import OrderInfo from '../payment/order-info';
import PointInfo from '../payment/point-info';
import PaymentWidget from '../payment/payment-widget';
import PaymentInfo from '../payment/payment-info';
import TermAgreements from '../payment/term-agreements';
import { Button } from '@/components/ui/button';
import { useLetter } from '../../_contexts/letter-provider';
import { useUserData } from '@/contexts/session';
import { usePayment } from '../../_hooks/use-payment';
import { createLetterData } from '../../_libs/create-letter-data';

export default function Payment() {
    // 사용자 데이터와 약관 동의 상태 관리
    const { userData } = useUserData();
    const [allAgreed, setAllAgreed] = useState(false);

    // 편지 관련 데이터 및 기능
    const {
        postTypes: selectedPostType,
        senderAddress,
        totalPrice,
        photo,
        letterId,
        template,
        text,
        font,
        recipientAddress,
        isUsingPoint,
        usePointAmount,
        earnPointAmount,
        setIsUsingPoint,
        applyPoint,
        resetPoint,
        useAllPoint,

        paperPrice,
        photoPrice,
        postTypePrice,
        initialPrice,

        paymentMethod,
        tossPaymentMethod,
    } = useLetter();

    // 편지 데이터 생성 함수
    const handleCreateLetterData = async () => {
        return createLetterData({
            letterId,
            template,
            text,
            font,
            photo,
            recipientAddress,
            senderAddress,
            selectedPostType,
            paperPrice,
            photoPrice,
            postTypePrice,
            initialPrice,
            totalPrice,
            isUsingPoint,
            usePointAmount,
            earnPointAmount,
        });
    };

    // 결제 관련 훅 사용
    const {
        isLoading,
        isProgressing,
        transferInfo,
        setTransferInfo,
        paymentWidget,
        setPaymentWidget,
        paymentMethodsWidget,
        setPaymentMethodsWidget,
        isPaymentReady,
        setIsPaymentReady,
        handlePayment,
        pointRatePercent,
        paymentMethodName,
    } = usePayment({
        userData,
        letterData: {
            text,
            recipientAddress,
            senderAddress,
            selectedPostType,
        },
        createLetterData: handleCreateLetterData,
        paymentMethod,
        tossPaymentMethod,
        isUsingPoint,
        totalPrice,
        template,
    });

    return (
        <div
            className="p-6 md:p-12 flex flex-col md:grid gap-8 md:gap-24 !pb-12"
            style={{ gridTemplateColumns: '3fr 2fr' }}
        >
            {/* 왼쪽 컬럼: 주문 정보, 포인트 정보, 결제 위젯 */}
            <div className="flex flex-col gap-12 pb-12">
                <OrderInfo />
                <PointInfo
                    isUsingPoint={isUsingPoint}
                    usePointAmount={usePointAmount}
                    earnPointAmount={earnPointAmount}
                    onTogglePointUse={setIsUsingPoint}
                    onApplyPoint={applyPoint}
                    onResetPoint={resetPoint}
                    onUseAllPoint={() => useAllPoint(userData?.point || 0)}
                    userPoint={userData?.point || 0}
                />
                {totalPrice > 0 && (
                    <PaymentWidget
                        transferInfo={transferInfo}
                        setTransferInfo={setTransferInfo}
                        setPaymentWidget={setPaymentWidget}
                        paymentMethodsWidget={paymentMethodsWidget}
                        setPaymentMethodsWidget={setPaymentMethodsWidget}
                        isPaymentReady={isPaymentReady}
                        setIsPaymentReady={setIsPaymentReady}
                    />
                )}
            </div>

            {/* 오른쪽 컬럼: 결제 정보, 약관 동의, 결제 버튼 */}
            <div className="flex flex-col gap-4">
                <div className="sticky top-12">
                    <PaymentInfo />
                    <TermAgreements allAgreed={allAgreed} setAllAgreed={setAllAgreed} />
                    <Button
                        variant="pink"
                        className="w-full h-12 text-base"
                        disabled={isLoading || isProgressing}
                        onClick={() => handlePayment(allAgreed)}
                    >
                        {isLoading || isProgressing ? '결제 중...' : '결제하기'}
                    </Button>

                    {/* 포인트 적립 정보 표시 */}
                    {!isUsingPoint && (
                        <div className="flex flex-col mt-2 p-2">
                            <div className="flex justify-between text-sm">
                                <div className="text-gray-450">적립 예정 포인트</div>
                                <div className="font-medium">
                                    {earnPointAmount.toLocaleString()}P
                                </div>
                            </div>
                            <div className="flex justify-between text-xs mt-1">
                                <div className="text-gray-400">{paymentMethodName} 결제 적립률</div>
                                <div className="text-gray-500">{pointRatePercent}%</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
