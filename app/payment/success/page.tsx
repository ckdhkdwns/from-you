import React from 'react';
import { getLetterByIdAction } from '@/models/actions/letter-actions';
import UnderlineText from '@/app/(common)/mypage/(default)/_components/underline-text';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { verifyAndCompleteTossPayment } from '@/models/actions/payment-actions';
import { paymentMethodConfig } from '@/constants';
import { LetterPublic } from '@/models/types/letter';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';

export default async function PaymentSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{
        letterId: string;
        orderId: string;
        paymentKey: string;
        amount: string;
        method: string;
    }>;
}) {
    const { letterId, orderId, paymentKey, amount, method } = await searchParams;

    let letterResult: LetterPublic;

    if (['point', 'transfer'].includes(method)) {
        const { success, data } = await getLetterByIdAction(letterId);

        if (!success) {
            redirect('/payment/fail');
        }

        letterResult = data;
    } else {
        const { success, data } = await verifyAndCompleteTossPayment({
            orderId,
            paymentKey,
            amount,
            letterId,
        });

        if (!success) {
            redirect('/payment/fail');
        }

        letterResult = data.letter;
    }

    return (
        <div className="container max-w-xl mx-auto py-12 my-auto flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col gap-4 items-center w-full">
                {/* <Image
                    src="/favicons/apple-touch-icon.png"
                    alt="logo"
                    width={180}
                    height={180}
                /> */}

                <div className="text-xl font-semibold text-center text-primary-black">
                    주문이 완료되었습니다.
                </div>
                <div className="flex justify-center gap-4 mb-8">
                    <span className="text-gray-500">주문번호</span>
                    <span className="text-secondary-newpink font-semibold">
                        {letterResult.orderId}
                    </span>
                </div>

                <div className="w-full">
                    <p className="text-lg font-semibold text-left mb-2">주문정보</p>
                    <div className="w-full h-px bg-primary-black" />
                    <div className="flex flex-col justify-start items-start w-full gap-6">
                        <div className="flex justify-start items-center w-full gap-12 pl-6 mt-4">
                            <div className="w-[100px] h-[100px] relative">
                                <Image
                                    src={letterResult.template.thumbnail}
                                    alt="편지 이미지"
                                    fill
                                    objectFit="cover"
                                />
                            </div>
                            <div className="flex flex-col justify-start items-start gap-2">
                                <div className="flex flex-col justify-start items-start w-full">
                                    <div className="flex justify-center items-center relative gap-2.5">
                                        <p className="text-base font-medium text-left ">
                                            {letterResult.template.name}
                                        </p>
                                    </div>
                                    <div className="flex justify-center items-center relative gap-0.5">
                                        <p className="text-sm text-left text-[#777]">
                                            {letterResult.priceInfo.totalPrice.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-left text-[#777]">원</p>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-start items-start gap-2">
                                    <div className="flex justify-start items-start gap-8">
                                        <div className="flex justify-center items-center relative gap-2.5">
                                            <p className="text-sm text-left">
                                                <span className="text-sm text-left text-[#777]">
                                                    편지{' '}
                                                </span>
                                                <span className="text-sm font-medium text-left ">
                                                    1
                                                </span>
                                                <span className="text-sm text-left text-[#777]">
                                                    장
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-start items-start gap-[30px]">
                                        <div className="flex justify-center items-center relative gap-2.5">
                                            <p className="text-sm text-left">
                                                <span className="text-sm text-left text-[#777]">
                                                    사진{' '}
                                                </span>
                                                <span className="text-sm font-medium text-left ">
                                                    {letterResult.photos.length}
                                                </span>
                                                <span className="text-sm text-left text-[#777]">
                                                    장
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-start items-start gap-[30px]">
                                        <div className="flex justify-center items-center relative gap-2.5">
                                            <p className="text-sm text-left text-[#777]">
                                                {letterResult.postType === '72'
                                                    ? '일반우편'
                                                    : '등기우편'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-start items-start w-full relative gap-4 border-t border-gray-200 pt-4">
                            <div className="px-6">
                                <UnderlineText length="120%">
                                    {paymentMethodConfig[letterResult.paymentMethod].label}
                                </UnderlineText>
                            </div>
                            {letterResult.pointInfo?.earnPointAmount > 0 && (
                                <div className="flex justify-between items-center w-full px-4">
                                    <div className="font-normal">예상 적립 포인트</div>
                                    <div className="font-medium text-primary-black">
                                        {letterResult.pointInfo.earnPointAmount.toLocaleString()} P
                                    </div>
                                </div>
                            )}
                            <div className="w-full h-[1px] bg-primary-black" />
                            {letterResult.pointInfo?.earnPointAmount > 0 && (
                                <div className="text-sm text-gray-500 px-4">
                                    포인트는 배송 완료 후 지급됩니다
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-2 mt-8">
                    <Link href="/mypage">
                        <Button variant="outline">메인으로 이동</Button>
                    </Link>
                    <Link href={`/mypage/letters/sent/${removeTableKeyPrefix(letterResult?.SK)}`}>
                        <Button variant="outlinePink">주문 확인하기</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
