import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { CheckCircle2 } from 'lucide-react';
import React from 'react';

export default function TransferSuccess({ orderId, amount }: { orderId: string; amount: string }) {
    return (
        <div className="container max-w-md mx-auto py-12">
            <Card>
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl">결제가 완료되었습니다</CardTitle>
                    <CardDescription>편지 발송이 정상적으로 접수되었습니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">주문번호</span>
                                <span className="font-medium">{orderId}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-gray-500">결제 방식</span>
                                <span className="font-medium">계좌이체</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-gray-500">결제 금액</span>
                                <span className="font-medium text-blue-600">
                                    {parseInt(amount).toLocaleString()}원
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-md text-blue-700 text-sm">
                        <p className="font-medium">발송 안내</p>
                        <p className="mt-1">
                            편지는 영업일 기준 1-2일 내에 발송됩니다. 발송 상태는 마이페이지에서
                            확인하실 수 있습니다.
                        </p>
                    </div>
                </CardContent>
                {/* <CardFooter className="flex flex-col space-y-2">
            <Button onClick={handleGoToMyPage} className="w-full">
                마이페이지로 이동
            </Button>
            <Button
                onClick={handleGoToHome}
                variant="outline"
                className="w-full"
            >
                홈으로 돌아가기
            </Button>
        </CardFooter> */}
            </Card>
        </div>
    );
}
