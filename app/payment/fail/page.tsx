'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PaymentFailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [_errorInfo, setErrorInfo] = useState<{
        code: string;
        message: string;
        orderId: string;
    } | null>(null);

    useEffect(() => {
        // URL 파라미터에서 오류 정보 가져오기
        const code = searchParams.get('code');
        const message = searchParams.get('message');
        const orderId = searchParams.get('orderId');

        if (code && message) {
            setErrorInfo({
                code,
                message: decodeURIComponent(message),
                orderId: orderId || '알 수 없음',
            });
        }

        setIsLoading(false);
    }, [searchParams]);

    const handleGoToHome = () => {
        router.push('/');
    };

    if (isLoading) {
        return (
            <div className="container max-w-md mx-auto py-12">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-center items-center h-40">
                            <p className="text-gray-500">결제 정보를 확인하는 중입니다...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-md mx-auto py-12 h-screen flex flex-col justify-center">
            <div className="flex flex-col gap-4 items-center">
                <div className="text-xl font-semibold text-center text-primary-black">
                    결제에 실패했습니다.
                </div>

                <div className="p-4 text-gray-700 text-sm">
                    <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li>카드 한도 초과 또는 잔액 부족이 아닌지 확인해주세요.</li>
                        <li>결제 정보가 올바른지 확인 후 다시 시도해주세요.</li>
                        <li>문제가 지속되면 고객센터로 문의해주세요.</li>
                    </ul>
                </div>

                <div className="flex gap-2 w-full">
                    <Button onClick={handleGoToHome} variant="outline" className="w-full">
                        홈으로 돌아가기
                    </Button>
                    {/* <Button onClick={handleRetryPayment} className="w-full">
                        결제 다시 시도하기
                    </Button> */}
                </div>
            </div>
        </div>
    );
}
