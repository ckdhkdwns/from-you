'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { COMPANY_INFO } from '@/constants/data/footer-business-info';

export default function Footer() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <footer className="w-full flex justify-center bg-primary-ivory mt-auto">
            <div className="w-full max-w-7xl flex flex-col gap-4 px-6 py-6">
                <div className="w-full h-px bg-gray-200" />

                {/* 링크 섹션 */}
                {/* <div className="flex gap-6 mb-4">
                    {FOOTER_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div> */}

                <div className="flex flex-col gap-3 px-3">
                    {/* 회사 정보 토글 버튼 */}
                    <div
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <div className="relative w-4 h-4">
                            <Image
                                src="/favicons/favicon-32x32.png"
                                alt="로고"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <p className="text-xs font-medium">프롬유 사업자 정보</p>
                        {isExpanded ? (
                            <ChevronUp size={20} className="text-primary-black" strokeWidth={1} />
                        ) : (
                            <ChevronDown size={20} className="text-primary-black" strokeWidth={1} />
                        )}
                    </div>

                    {/* 회사 정보 섹션 */}
                    {isExpanded && (
                        <div className="flex flex-col md:flex-row gap-6 md:gap-12 pl-7">
                            <div className="flex flex-col gap-2">
                                <p className="text-xs">{COMPANY_INFO.companyName}</p>
                                <p className="text-xs">{COMPANY_INFO.representative}</p>
                                <p className="text-xs">{COMPANY_INFO.businessNumber}</p>
                                <p className="text-xs">{COMPANY_INFO.communicationNumber}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-xs">{COMPANY_INFO.address}</p>
                                <p className="text-xs">{COMPANY_INFO.phone}</p>
                                <p className="text-xs">{COMPANY_INFO.bankAccount}</p>
                                <p className="text-xs">
                                    {COMPANY_INFO.businessHours} {COMPANY_INFO.lunchHours}{' '}
                                    {COMPANY_INFO.holidays}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <p className="text-xs text-[#8c8c8c] mt-2 ml-3">
                    ⓒ {new Date().getFullYear()}. 프롬유(From.You) All rights reserved.
                </p>
            </div>
        </footer>
    );
}
