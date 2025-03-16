'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet';
import { useState } from 'react';
import { ArrowLeft } from 'react-feather';
import { STEP_INFO, StepKey } from '@/app/(no-header)/write/_types/steps';

export default function WriteHeader({ currentStep }: { currentStep: StepKey }) {
    const router = useRouter();
    const { data: session } = useSession();
    const pathname = usePathname();
    const isMobile = useIsMobile();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const guestMenuItems = [
        { label: '로그인', path: '/login' },
        { label: '회원가입', path: '/sign-up' },
    ];

    const userMenuItems = [
        { label: '편지쓰기', path: '/templates' },
        { label: '마이페이지', path: '/mypage' },
        { label: '이벤트', path: '/support/event' },
        { label: '공지사항', path: '/support/notice' },
        { label: '고객센터', path: '/support' },
        { label: '로그아웃', action: () => handleLogout() },
    ];

    const menuItems = session ? userMenuItems : guestMenuItems;

    const handleLogout = async () => {
        await signOut({ redirect: false });
        toast.info('로그아웃 되었습니다.');
        router.push('/');
    };

    const handleMenuItemClick = (item: { label: string; path?: string; action?: () => void }) => {
        if (item.action) {
            item.action();
            setIsSheetOpen(false);
        } else {
            router.push(item.path);
            setIsSheetOpen(false);
        }
    };

    const handleGoBack = () => {
        router.push('/');
    };

    // 홈 페이지인지 확인
    const isHomePage = pathname === '/';

    return (
        <div className={`flex justify-center items-center px-2 md:px-4 pl-0 !bg-primary-ivory`}>
            <div className="container flex justify-between items-center relative py-4">
                {isMobile ? (
                    // 모바일 환경에서의 레이아웃
                    <>
                        {/* 홈 페이지가 아닐 때만 뒤로가기 버튼 표시 */}
                        {!isHomePage && (
                            <button onClick={handleGoBack} className="cursor-pointer">
                                <ArrowLeft strokeWidth={1.5} />
                            </button>
                        )}

                        {/* 중앙에 로고 배치 */}
                        <div className="text-lg font-semibold">{STEP_INFO[currentStep].title}</div>

                        {/* 오른쪽에 메뉴 버튼 배치 */}
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <Image
                                    src="/icons/menu.svg"
                                    alt="menu"
                                    width={24}
                                    height={24}
                                    className="cursor-pointer max-md:w-6 max-md:h-6"
                                />
                            </SheetTrigger>
                            <SheetTitle className="hidden">메뉴</SheetTitle>
                            <SheetContent side="right" className="p-0 pt-10">
                                <div className="flex flex-col p-4 space-y-2">
                                    {menuItems.map(item => (
                                        <button
                                            key={item.path || 'logout'}
                                            onClick={() => handleMenuItemClick(item)}
                                            className="cursor-pointer font-normal text-primary-black p-3 rounded-lg text-left hover:bg-gray-100 w-full"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </>
                ) : (
                    // 데스크톱 환경에서의 레이아웃
                    <>
                        <div className="flex items-center gap-4">
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger>
                                    <Image
                                        src="/icons/menu.svg"
                                        alt="menu"
                                        width={24}
                                        height={24}
                                        className="cursor-pointer"
                                    />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="start"
                                    className="w-[200px] border-none p-4 space-y-0 rounded-xl"
                                    style={{
                                        boxShadow: '0px 2px 36px 0 rgba(0,0,0,0.2)',
                                    }}
                                >
                                    {menuItems.map(item => (
                                        <DropdownMenuItem
                                            key={item.path || 'logout'}
                                            onClick={() => handleMenuItemClick(item)}
                                            className="cursor-pointer font-normal text-primary-black p-2 rounded-lg"
                                        >
                                            {item.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Image
                                src="/logo.png"
                                alt="logo"
                                width={120}
                                height={64}
                                onClick={() => router.push('/')}
                                className="cursor-pointer max-md:w-[100px] max-md:h-auto"
                            />
                        </div>

                        {/* 오른쪽 영역을 위한 빈 div */}
                        <div></div>
                    </>
                )}
            </div>
        </div>
    );
}
