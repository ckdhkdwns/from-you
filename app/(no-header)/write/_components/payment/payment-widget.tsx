import { useLetter } from '../../_contexts/letter-provider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import {
    loadTossPayments,
    TossPaymentsWidgets,
    ANONYMOUS,
    WidgetPaymentMethodWidget,
} from '@tosspayments/tosspayments-sdk';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TransferInfo } from '@/models/types/letter';

interface PaymentWidgetProps {
    transferInfo: TransferInfo;
    setTransferInfo: (_transferInfo: TransferInfo) => void;
    setPaymentWidget: (_paymentWidget: TossPaymentsWidgets | null) => void;
    paymentMethodsWidget: WidgetPaymentMethodWidget | null;
    setPaymentMethodsWidget: (_paymentMethodsWidget: WidgetPaymentMethodWidget | null) => void;
    isPaymentReady: boolean;
    setIsPaymentReady: (_isPaymentReady: boolean) => void;
}

export default function PaymentWidget({
    transferInfo,
    setTransferInfo,
    setPaymentWidget,
    setPaymentMethodsWidget,
    setIsPaymentReady,
}: PaymentWidgetProps) {
    const {
        postTypes: selectedPostType,
        totalPrice,
        paymentMethod,
        setPaymentMethod,
        setTossPaymentMethod,
    } = useLetter();

    useEffect(() => {
        // 결제 위젯 로드
        const fetchPaymentWidget = async () => {
            try {
                const tossPayments = await loadTossPayments(
                    process.env.NEXT_PUBLIC_TOSSPAY_CLIENT_KEY,
                );
                const widgets = tossPayments.widgets({
                    customerKey: ANONYMOUS,
                });

                // 결제 위젯 인스턴스 저장
                setPaymentWidget(widgets);

                widgets.setAmount({
                    currency: 'KRW',
                    value: totalPrice,
                });

                // 결제 수단 위젯
                const methodsWidget = await widgets.renderPaymentMethods({
                    selector: '#payment-widget',
                    variantKey: 'DEFAULT',
                });

                setPaymentMethodsWidget(methodsWidget);

                const currentPaymentMethod = await methodsWidget.getSelectedPaymentMethod();
                setTossPaymentMethod(currentPaymentMethod.code);

                methodsWidget.on('paymentMethodSelect', event => {
                    setTossPaymentMethod(event.code);
                });

                // 결제 준비 완료
                setIsPaymentReady(true);
            } catch (error) {
                console.log('결제 위젯 로드 실패:', error);
            }
        };

        if (paymentMethod === 'toss' && selectedPostType && totalPrice > 0) {
            fetchPaymentWidget();
        }

        // // 컴포넌트 언마운트 시 정리
        // return () => {
        //     if (paymentMethodsWidget) {
        //         try {
        //             paymentMethodsWidget.destroy();
        //         } catch (error) {
        //             console.log("결제 수단 위젯 제거 실패:", error);
        //         }
        //     }
        // };
    }, [selectedPostType, totalPrice]);

    // // 탭 변경 시 위젯 정리
    // useEffect(() => {
    //     if (activeTab !== "toss") {
    //         if (paymentMethodsWidget) {
    //             try {
    //                 paymentMethodsWidget.destroy();
    //             } catch (error) {
    //                 console.log("탭 변경 시 결제 수단 위젯 제거 실패:", error);
    //             }

    //             setPaymentMethodsWidget(null);
    //         }

    //         setPaymentWidget(null);
    //         setIsPaymentReady(false);
    //     }
    // }, [activeTab]);
    // 편지 데이터 생성 공통 함수

    // 현금영수증 유형 변경 처리
    const handleCashReceiptTypeChange = (value: string) => {
        setTransferInfo({
            ...transferInfo,
            cashReceiptType: value as 'none' | 'personal' | 'business',
        });
    };
    return (
        <div className="flex flex-col gap-2">
            <div className="text-lg font-semibold">결제방법</div>
            <div className="w-full h-[1px] bg-primary-black" />

            <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="flex flex-col gap-4 p-2"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="toss" id="toss" />
                    <Label htmlFor="toss" className="cursor-pointer">
                        간편결제
                    </Label>
                </div>
                {/* 토스페이먼츠 결제 위젯이 렌더링될 영역 */}
                <div
                    id="payment-widget"
                    className={cn(
                        'w-full min-h-[300px] pl-6',
                        paymentMethod === 'toss' ? 'block' : 'hidden',
                    )}
                ></div>
                <div className="flex items-center space-x-2"> 
                    <RadioGroupItem value="transfer" id="transfer" />
                    <Label htmlFor="transfer" className="cursor-pointer">
                        계좌이체
                    </Label>
                </div>
                <div
                    className={cn(
                        'space-y-4 ml-6',
                        paymentMethod === 'transfer' ? 'block' : 'hidden',
                    )}
                >
                    <div className="space-y-2">
                        <Label htmlFor="depositorName">입금자명</Label>
                        <input
                            id="depositorName"
                            value={transferInfo.depositorName}
                            onChange={e =>
                                setTransferInfo({
                                    ...transferInfo,
                                    depositorName: e.target.value,
                                })
                            }
                            placeholder="입금자명을 입력해주세요"
                            className="rounded-none border-b border-gray-200 w-full bg-transparent p-1 ring-0 focus:outline-none focus:ring-0 focus:border-gray-400 text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>현금영수증</Label>
                        <RadioGroup
                            value={transferInfo.cashReceiptType}
                            onValueChange={handleCashReceiptTypeChange}
                            className="flex flex-col space-y-1"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="none" id="none" />
                                <Label htmlFor="none" className="cursor-pointer">
                                    신청 안함
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="personal" id="personal" />
                                <Label htmlFor="personal" className="cursor-pointer">
                                    개인 (휴대폰번호)
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="business" id="business" />
                                <Label htmlFor="business" className="cursor-pointer">
                                    사업자 (사업자등록번호)
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {transferInfo.cashReceiptType !== 'none' && (
                        <div className="space-y-2">
                            <Label htmlFor="cashReceiptNumber">
                                {transferInfo.cashReceiptType === 'personal'
                                    ? '휴대폰번호'
                                    : '사업자등록번호'}
                            </Label>
                            <input
                                id="cashReceiptNumber"
                                value={transferInfo.cashReceiptNumber}
                                onChange={e =>
                                    setTransferInfo({
                                        ...transferInfo,
                                        cashReceiptNumber: e.target.value,
                                    })
                                }
                                className="rounded-none border-b border-gray-200 w-full bg-transparent p-1 ring-0 focus:outline-none focus:ring-0 focus:border-gray-400 text-sm"
                                placeholder={
                                    transferInfo.cashReceiptType === 'personal'
                                        ? '휴대폰번호 (- 없이 입력)'
                                        : '사업자등록번호 (- 없이 입력)'
                                }
                            />
                        </div>
                    )}
                </div>
            </RadioGroup>
        </div>
    );
}
