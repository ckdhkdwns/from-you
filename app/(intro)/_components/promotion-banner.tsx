import React from 'react';
import Image from 'next/image';

export default function PromotionBanner() {
    return (
        <div className="bg-tertiary-graywhite flex justify-between items-center  py-10 pl-20 rounded-2xl relative">
            <div>
                <p className="text-[28px] font-semibold text-left text-black">앱 다운로드 받고</p>
                <p className="text-[28px] font-semibold text-left text-[#fe5172]">
                    더 쉽고 빠르게 편지를 보내세요!
                </p>
                <p className="text-lg text-left text-[#8c8c8c]">
                    가족, 친구, 사랑하는 사람에게 언제 어디서든 편하게 마음을 전하세요.
                </p>
                <Image src="/temp/qr-code.png" alt="qr-code" width={100} height={100} />
            </div>

            <Image
                src="/promotion-banner.png"
                alt="promotion-banner"
                className="absolute bottom-0 right-[calc(20%-100px)]"
                width={200}
                height={400}
            />
        </div>
    );
}
