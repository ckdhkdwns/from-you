import React from 'react';

import Image from 'next/image';
import { Card } from '@/components/ui/card';

export default function EventSection() {
    return (
        <div className="space-y-2 relative">
            <Card className="p-6 md:p-8 md:h-[220px] relative items-center flex bg-[#E7F0E0] rounded-md border-none shadow-none z-10">
                <div className="flex justify-between items-center gap-8 z-50">
                    <Image
                        src="/temp/event-phone.png"
                        alt="이벤트 이미지"
                        width={116}
                        height={150}
                        className="object-contain absolute right-8 top-1/2 -translate-y-1/2 z-8 max-md:w-24 max-md:h-28"
                    />
                    <div className="space-y-6  z-10">
                        <div className="space-y-1.5">
                            <div className="space-y-1">
                                <p className="text-base text-[#4f4f4f]">포토리뷰 작성시,</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl md:text-3xl font-bold text-secondary-greennavy">
                                        3,000 포인트
                                    </span>
                                    <span className="text-base md:text-lg font-medium text-[#4f4f4f]">
                                        지급 행사
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-1 text-xs text-[#8c8c8c]">
                                <span>※</span>
                                <span>기간 한정 이벤트(~2025.01.02(월)까지)</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <p className="text-base text-gray-500">리뷰 작성하러 가기</p>
                            <Image
                                src="/icons/half-arrow-right.svg"
                                alt="arrow-right"
                                width={24}
                                height={24}
                            />
                        </div>
                    </div>
                </div>
            </Card>
            <div className="absolute top-[-160px] lg:top-[-200px] left-[-250px] lg:left-[-320px] z-0 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px]">
                <Image src="/give.png" alt="이벤트 이미지" fill className="object-cover " />
            </div>
        </div>
    );
}
