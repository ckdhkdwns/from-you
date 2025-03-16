import React from 'react';
import { REFUND_TERM_TEXT } from '@/constants';

export default function Refund() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex w-fit items-center gap-4">
                {/* <Image
                    src="/favicons/apple-touch-icon.png"
                    alt="logo"
                    width={40}
                    height={40}
                /> */}
                <div className="relative">
                    <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 bg-primary-pink"
                        style={{ width: '110%' }}
                    ></div>
                    <div className="text-2xl font-bold relative z-10">구매 및 환불 약관</div>
                </div>
            </div>

            <div className="text-base text-gray-500 whitespace-pre-wrap break-words">
                {REFUND_TERM_TEXT}
            </div>
        </div>
    );
}
