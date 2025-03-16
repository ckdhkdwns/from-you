'use client';

import React, { useState } from 'react';

import OrderInfo from '../payment/order-info';
import PointInfo from '../payment/point-info';
import PaymentWidget from '../payment/payment-widget';
import PaymentInfo from '../payment/payment-info';
import TermAgreements from '../payment/term-agreements';
import { Button } from '@/components/ui/button';
import { useLetter } from '../../_contexts/letter-provider';
import { parsePhotos } from '../../_libs/parse-photos';
import { TossPaymentsWidgets, WidgetPaymentMethodWidget } from '@tosspayments/tosspayments-sdk';
import { useUserData } from '@/contexts/session';
import { LetterInput, TransferInfo } from '@/models/types/letter';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { validateLetterData } from '../../_libs/validate';
import { STEP_KEYS } from '../../_types/steps';
import {
    initiateAccountTransferPaymentAction,
    initiateTossPaymentAction,
    processPointOnlyPaymentAction,
} from '@/models/actions/payment-actions';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';
import { paymentMethodMapping, POINT_RATE } from '@/constants';

export default function Payment() {
    const { userData } = useUserData();
    const [allAgreed, setAllAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [paymentWidget, setPaymentWidget] = useState<TossPaymentsWidgets | null>(null);
    const [paymentMethodsWidget, setPaymentMethodsWidget] =
        useState<WidgetPaymentMethodWidget | null>(null);

    const [isPaymentReady, setIsPaymentReady] = useState(false);
    const [isProgressing, setIsProgressing] = useState(false);

    const [transferInfo, setTransferInfo] = useState<TransferInfo>({
        depositorName: '',
        cashReceiptType: 'none',
        cashReceiptNumber: '',
    });

    const router = useRouter();

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

    const createLetterData = async (): Promise<LetterInput> => {
        const photos = await parsePhotos(photo);

        // 템플릿 객체 형태 수정 (LetterInput 타입에 맞춤)
        const templateData = {
            PK: template?.PK || '',
            SK: template?.SK || '',
            name: template?.name || '',
            thumbnail: template?.thumbnail || '',
            paperImage: template?.paperImage || '',
        };

        return {
            id: removeTableKeyPrefix(letterId),

            template: templateData,
            text: text,
            font: font,
            photos: photos,
            recipientAddress: recipientAddress,
            senderAddress: senderAddress,
            postType: selectedPostType,
            // 가격 정보 구조
            priceInfo: {
                paperPrice,
                photoPrice,
                postTypePrice,
                initialPrice,
                totalPrice,
            },
            pointInfo: {
                isUsingPoint,
                usePointAmount,
                earnPointAmount,
            },
        };
    };

    // 결제 요청 처리
    const handlePayment = async () => {
        if (!allAgreed) {
            toast.warning('이용약관에 동의해주세요.');
            setIsProgressing(false);
            setIsLoading(false);
            return;
        }

        const { isValid, errorMessage } = validateLetterData(
            {
                currentStep: STEP_KEYS.PAYMENT,
                text,
                recipientAddress,
                senderAddress,
                postTypes: selectedPostType,
            },
            true,
        );

        if (!isValid) {
            toast.warning(errorMessage);
            setIsProgressing(false);
            setIsLoading(false);
            return;
        }

        setIsProgressing(true);

        if (isUsingPoint && totalPrice === 0) {
            try {
                const letterData = await createLetterData();
                const result = await processPointOnlyPaymentAction(letterData);

                if (!result.success) {
                    throw new Error('결제 요청에 실패했습니다.');
                }

                const resultLetterId = removeTableKeyPrefix(result.data.letter?.SK);

                router.push(`/payment/success?letterId=${resultLetterId}&method=point`);
            } catch (error) {
                console.error('결제 요청 실패:', error);
            } finally {
                setIsLoading(false);
                setIsProgressing(false);
            }
            return;
        }

        if (paymentMethod === 'toss') {
            if (!paymentWidget || !isPaymentReady) return;

            setIsLoading(true);
            try {
                const letterData = await createLetterData();

                const { data: result } = await initiateTossPaymentAction(
                    letterData as LetterInput,
                    tossPaymentMethod,
                );

                const orderId = result.orderId;
                const letterId = removeTableKeyPrefix(result?.SK);

                // 결제 요청
                await paymentWidget.requestPayment({
                    orderId: orderId,
                    orderName: template?.name || '',
                    customerName: userData?.name || '',
                    successUrl: `${window.location.origin}/payment/success?method=toss&letterId=${letterId}`,
                    failUrl: `${window.location.origin}/payment/fail?method=toss&letterId=${letterId}`,
                });
                setIsLoading(false);
            } catch (error) {
                console.log('결제 요청 실패:', error);
                if (error.code === 'USER_CANCEL') {
                    toast.warning('취소되었습니다.');
                }
                setIsLoading(false);
            } finally {
                setIsLoading(false);
                setIsProgressing(false);
            }
        } else if (paymentMethod === 'transfer') {
            if (!transferInfo.depositorName) {
                toast.warning('입금자명을 입력해주세요.');
                return;
            }

            setIsLoading(true);

            try {
                const letterData = await createLetterData();

                const result = await initiateAccountTransferPaymentAction({
                    ...letterData,
                    transferInfo: transferInfo,
                });

                if (!result.success) {
                    throw new Error('계좌이체 정보 저장에 실패했습니다.');
                }

                // 헬퍼 함수를 사용하여 ID 추출
                const resultLetterId = removeTableKeyPrefix(result.data.letter?.SK);

                router.push(
                    `/payment/success?method=transfer&price=${totalPrice}&letterId=${resultLetterId}`,
                );
            } catch (error) {
                console.error('계좌이체 처리 중 오류 발생:', error);
            } finally {
                setIsLoading(false);
                setIsProgressing(false);
            }
        }
    };

    // 현재 선택된 결제 수단의 포인트 적립률 계산
    const getPointRateInfo = () => {
        if (paymentMethod === 'toss' && tossPaymentMethod) {
            return POINT_RATE[tossPaymentMethod] || POINT_RATE.default;
        } else {
            return POINT_RATE[paymentMethod.toLowerCase()] || POINT_RATE.default;
        }
    };

    // 결제 수단 이름 표시
    const getPaymentMethodName = () => {
        if (paymentMethod === 'toss' && tossPaymentMethod) {
            // 토스페이먼츠 결제 수단 이름
            return paymentMethodMapping[tossPaymentMethod] || tossPaymentMethod;
        } else {
            // 일반 결제 수단 이름
            return paymentMethodMapping[paymentMethod] || paymentMethod;
        }
    };

    const pointRateInfo = getPointRateInfo();
    const pointRatePercent =
        pointRateInfo.type === 'percent' ? (pointRateInfo.rate * 100).toFixed(1) : '0';
    const paymentMethodName = getPaymentMethodName();

    return (
        <div
            className="p-6 md:p-12 flex flex-col md:grid gap-8 md:gap-24 !pb-12"
            style={{ gridTemplateColumns: '3fr 2fr' }}
        >
            <div className={'flex flex-col gap-12 pb-12'}>
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

            <div className="flex flex-col gap-4">
                <div className="sticky top-12">
                    <PaymentInfo />
                    <TermAgreements allAgreed={allAgreed} setAllAgreed={setAllAgreed} />
                    <Button
                        variant="pink"
                        className="w-full h-12 text-base"
                        disabled={isLoading || isProgressing}
                        onClick={handlePayment}
                    >
                        {isLoading || isProgressing ? '결제 중...' : '결제하기'}
                    </Button>

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
