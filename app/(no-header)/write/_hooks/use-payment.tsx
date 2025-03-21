'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { TossPaymentsWidgets, WidgetPaymentMethodWidget } from '@tosspayments/tosspayments-sdk';

import { LetterInput, TransferInfo } from '@/models/types/letter';
import { validateLetterData } from '../_libs/validate';
import { STEP_KEYS } from '../_types/steps';
import {
    initiateAccountTransferPaymentAction,
    initiateTossPaymentAction,
    processPointOnlyPaymentAction,
} from '@/models/actions/payment-actions';
import { removeTableKeyPrefix } from '@/lib/api-utils';
import { paymentMethodMapping, POINT_RATE } from '@/constants';
import { AddressPublic } from '@/models/types/address';

interface PaymentHookProps {
    userData: any;
    letterData: {
        text: string | string[];
        recipientAddress: AddressPublic;
        senderAddress: AddressPublic;
        selectedPostType: string;
    };
    createLetterData: () => Promise<LetterInput>;
    paymentMethod: string;
    tossPaymentMethod?: string;
    isUsingPoint: boolean;
    totalPrice: number;
    template: any;
}

interface PaymentHookReturn {
    isLoading: boolean;
    isProgressing: boolean;
    transferInfo: TransferInfo;
    setTransferInfo: React.Dispatch<React.SetStateAction<TransferInfo>>;
    paymentWidget: TossPaymentsWidgets | null;
    setPaymentWidget: React.Dispatch<React.SetStateAction<TossPaymentsWidgets | null>>;
    paymentMethodsWidget: WidgetPaymentMethodWidget | null;
    setPaymentMethodsWidget: React.Dispatch<React.SetStateAction<WidgetPaymentMethodWidget | null>>;
    isPaymentReady: boolean;
    setIsPaymentReady: React.Dispatch<React.SetStateAction<boolean>>;
    handlePayment: (allAgreed: boolean) => Promise<void>;
    pointRateInfo: any;
    pointRatePercent: string;
    paymentMethodName: string;
}

export function usePayment({
    userData,
    letterData,
    createLetterData,
    paymentMethod,
    tossPaymentMethod,
    isUsingPoint,
    totalPrice,
    template,
}: PaymentHookProps): PaymentHookReturn {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isProgressing, setIsProgressing] = useState(false);
    
    const [paymentWidget, setPaymentWidget] = useState<TossPaymentsWidgets | null>(null);
    const [paymentMethodsWidget, setPaymentMethodsWidget] = 
        useState<WidgetPaymentMethodWidget | null>(null);
    const [isPaymentReady, setIsPaymentReady] = useState(false);
    
    const [transferInfo, setTransferInfo] = useState<TransferInfo>({
        depositorName: '',
        cashReceiptType: 'none',
        cashReceiptNumber: '',
    });

    // 결제 요청 처리
    const handlePayment = async (allAgreed: boolean) => {
        if (!allAgreed) {
            toast.warning('이용약관에 동의해주세요.');
            setIsProgressing(false);
            setIsLoading(false);
            return;
        }

        const { text, recipientAddress, senderAddress, selectedPostType } = letterData;
        
        const { isValid, errorMessage } = validateLetterData(
            {
                currentStep: STEP_KEYS.PAYMENT,
                text: Array.isArray(text) ? text : [text],
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

        try {
            // 포인트로만 결제하는 경우
            if (isUsingPoint && totalPrice === 0) {
                await handlePointOnlyPayment();
                return;
            }

            // 토스 결제
            if (paymentMethod === 'toss') {
                await handleTossPayment();
                return;
            }

            // 계좌이체 결제
            if (paymentMethod === 'transfer') {
                await handleTransferPayment();
                return;
            }
        } catch (error) {
            console.error('결제 요청 실패:', error);
            toast.error('결제 처리 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
            setIsProgressing(false);
        }
    };

    // 포인트 전용 결제 처리
    const handlePointOnlyPayment = async () => {
        const letterData = await createLetterData();
        const result = await processPointOnlyPaymentAction(letterData);

        if (!result.success) {
            throw new Error('결제 요청에 실패했습니다.');
        }

        const resultLetterId = removeTableKeyPrefix(result.data.letter?.SK);
        router.push(`/payment/success?letterId=${resultLetterId}&method=point`);
    };

    // 토스 결제 처리
    const handleTossPayment = async () => {
        if (!paymentWidget || !isPaymentReady) return;

        setIsLoading(true);
        
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
    };

    // 계좌이체 결제 처리
    const handleTransferPayment = async () => {
        if (!transferInfo.depositorName) {
            toast.warning('입금자명을 입력해주세요.');
            throw new Error('입금자명 미입력');
        }

        setIsLoading(true);
        
        const letterData = await createLetterData();
        const result = await initiateAccountTransferPaymentAction({
            ...letterData,
            transferInfo: transferInfo,
        });

        if (!result.success) {
            throw new Error('계좌이체 정보 저장에 실패했습니다.');
        }

        const resultLetterId = removeTableKeyPrefix(result.data.letter?.SK);
        router.push(
            `/payment/success?method=transfer&price=${totalPrice}&letterId=${resultLetterId}`,
        );
    };

    // 현재 선택된 결제 수단의 포인트 적립률 계산
    const getPointRateInfo = () => {
        if (paymentMethod === 'toss' && tossPaymentMethod) {
            return POINT_RATE[tossPaymentMethod] || POINT_RATE.default;
        } 
        return POINT_RATE[paymentMethod.toLowerCase()] || POINT_RATE.default;
    };

    // 결제 수단 이름 표시
    const getPaymentMethodName = () => {
        if (paymentMethod === 'toss' && tossPaymentMethod) {
            // 토스페이먼츠 결제 수단 이름
            return paymentMethodMapping[tossPaymentMethod] || tossPaymentMethod;
        }
        // 일반 결제 수단 이름
        return paymentMethodMapping[paymentMethod] || paymentMethod;
    };

    const pointRateInfo = getPointRateInfo();
    const pointRatePercent =
        pointRateInfo.type === 'percent' ? (pointRateInfo.rate * 100).toFixed(1) : '0';
    const paymentMethodName = getPaymentMethodName();

    return {
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
        pointRateInfo,
        pointRatePercent,
        paymentMethodName,
    };
} 