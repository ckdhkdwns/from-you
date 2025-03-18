'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserData } from '@/contexts/session';
import { ArrowLeft } from 'react-feather';
import { STEP_INFO, StepKey } from '@/app/(no-header)/write/_types/steps';

export interface MenuItem {
    label: string;
    path?: string;
    action?: () => void;
}

export const GUEST_MENU_ITEMS: MenuItem[] = [
    { label: '로그인', path: '/login' },
    { label: '회원가입', path: '/sign-up' },
];

export const USER_MENU_ITEMS: MenuItem[] = [
    { label: '편지쓰기', path: '/templates' },
    { label: '마이페이지', path: '/mypage' },
    { label: '보낸 편지함', path: '/mypage/letters/sent' },
    { label: '작성 가능 후기', path: '/mypage/reviews/prepared' },
    { label: '공지사항', path: '/support/notice' },
    { label: '고객센터', path: '/support' },
];

export const INTRO_HEADER_STYLES = {
    box: {
        width: '230px',
        height: '190px',
        boxShadow: '0px 2px 6px 0 rgba(0,0,0,0.25)',
    },
    dropdown: {
        width: '200px',
        boxShadow: '0px 2px 20px 0 rgba(0,0,0,0.1)',
    },
};

// 일반 헤더 스타일 관련 상수
export const HEADER_STYLES = {
    dropdown: {
        width: '200px',
        boxShadow: '0px 2px 36px 0 rgba(0,0,0,0.2)',
    },
};

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/sign-up',
    TEMPLATES: '/templates',
    MYPAGE: '/mypage',
};

const handleLogoutAction = (router: ReturnType<typeof useRouter>) => async () => {
    await signOut({ redirect: false });
    toast.info('로그아웃 되었습니다.');
    router.push(ROUTES.HOME);
};

function BaseHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const { userData } = useUserData();

    const isMobile = useIsMobile();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const userMenuItemsWithLogout: MenuItem[] = [
        ...USER_MENU_ITEMS,
        { label: '로그아웃', action: handleLogoutAction(router) },
    ];

    const menuItems = userData ? userMenuItemsWithLogout : GUEST_MENU_ITEMS;

    const handleMenuItemClick = (item: MenuItem) => {
        if (item.action) {
            item.action();
            setIsSheetOpen(false);
        } else if (item.path) {
            router.push(item.path);
            setIsSheetOpen(false);
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    // 홈 페이지인지 확인
    const isHomePage = pathname === ROUTES.HOME;

    return (
        <div
            className={`flex justify-center items-center px-2 md:px-4 pl-0 !bg-primary-ivory fixed container top-0 left-1/2 -translate-x-1/2 z-50`}
        >
            <div className="container flex justify-between items-center relative py-3">
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
                        <div className="">
                            <Image
                                src="/logo.png"
                                alt="logo"
                                width={120}
                                height={64}
                                onClick={() => router.push(ROUTES.HOME)}
                                className="cursor-pointer max-md:w-[100px] max-md:h-[40px] object-contain"
                            />
                        </div>

                        {userData?.id ? (
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
                        ) : (
                            <div className="flex items-center gap-6">
                                {isHomePage && (
                                    <button onClick={() => router.push(ROUTES.SIGNUP)}>
                                        회원가입
                                    </button>
                                )}
                                <button onClick={() => router.push(ROUTES.LOGIN)}>로그인</button>
                            </div>
                        )}
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
                                    style={HEADER_STYLES.dropdown}
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
                                onClick={() => router.push(ROUTES.HOME)}
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

function IntroHeader() {
    const router = useRouter();
    const { userData } = useUserData();
    const [headerPosition, setHeaderPosition] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 200) {
                setHeaderPosition(-120);
            } else {
                setHeaderPosition(0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 로그아웃 액션 추가
    const userMenuItemsWithLogout: MenuItem[] = [
        ...USER_MENU_ITEMS,
        { label: '로그아웃', action: handleLogoutAction(router) },
    ];

    const menuItems = userData?.id ? userMenuItemsWithLogout : GUEST_MENU_ITEMS;

    const handleMenuItemClick = (item: MenuItem) => {
        if (item.action) {
            item.action();
        } else if (item.path) {
            router.push(item.path);
        }
    };

    return (
        <div
            className="fixed z-[999] transition-all duration-300"
            style={{
                top: isMounted ? headerPosition : 0,
                left: 'max(calc(50% - 640px), 40px)',
            }}
        >
            <div
                className="w-[230px] h-[190px] rounded-bl-sm rounded-br-sm bg-primary-ivory flex flex-col justify-between"
                style={INTRO_HEADER_STYLES.box}
            >
                <div className="flex flex-col items-center justify-center mt-4">
                    <img
                        src="/logo.png"
                        className="w-[168px] h-[74px]  object-cover cursor-pointer"
                        onClick={() => router.push(ROUTES.HOME)}
                    />
                    <p className="text-sm font-semibold text-left text-gray-500">
                        {userData?.id
                            ? `${userData.name}님 환영합니다!`
                            : '로그인하고 편지를 작성해보세요!'}
                    </p>
                </div>
                <div className="flex justify-between items-center w-full p-[32px]">
                    <DropdownMenu modal={false} defaultOpen={true}>
                        <DropdownMenuTrigger asChild>
                            <Image
                                src="/icons/menu.svg"
                                alt="menu"
                                width={24}
                                height={24}
                                className="cursor-pointer max-md:w-5 max-md:h-5"
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="start"
                            alignOffset={-16}
                            className="w-[200px] rounded-bl-[5px] rounded-br-[5px] bg-[#e7f0e0] border-none p-4"
                            style={INTRO_HEADER_STYLES.dropdown}
                        >
                            <div className="flex flex-col justify-center items-center gap-4">
                                <div className="rounded-bl-sm rounded-br-sm border-t-0 border-r border-b border-l border-[#b0bda6] w-full flex flex-col justify-center items-center pt-6 pb-2">
                                    {menuItems.map(item => (
                                        <DropdownMenuItem
                                            key={item.path || 'logout'}
                                            onClick={() => handleMenuItemClick(item)}
                                            className="text-base font-medium text-center text-[#233329] hover:bg-transparent focus:bg-transparent cursor-pointer"
                                            style={{
                                                filter: 'none',
                                            }}
                                        >
                                            {item.label}
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Image
                        src="/icons/bell.svg"
                        alt="bell"
                        width={24}
                        height={24}
                        className="cursor-pointer max-md:w-5 max-md:h-5"
                    />
                </div>
            </div>
        </div>
    );
}

function WriteHeader({ currentStep }: { currentStep: StepKey }) {
    const router = useRouter();
    const { data: session } = useSession();
    const pathname = usePathname();
    const isMobile = useIsMobile();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // 로그아웃 액션 추가
    const userMenuItemsWithLogout: MenuItem[] = [
        ...USER_MENU_ITEMS,
        { label: '로그아웃', action: handleLogoutAction(router) },
    ];

    const menuItems = session ? userMenuItemsWithLogout : GUEST_MENU_ITEMS;

    const handleMenuItemClick = (item: MenuItem) => {
        if (item.action) {
            item.action();
            setIsSheetOpen(false);
        } else if (item.path) {
            router.push(item.path);
            setIsSheetOpen(false);
        }
    };

    const handleGoBack = () => {
        router.push(ROUTES.HOME);
    };

    // 홈 페이지인지 확인
    const isHomePage = pathname === ROUTES.HOME;

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
                                    style={HEADER_STYLES.dropdown}
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
                                onClick={() => router.push(ROUTES.HOME)}
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

export default function Header({ writeStep }: { writeStep?: StepKey }) {
    const pathname = usePathname();
    const isMobile = useIsMobile();
    const isHomePage = pathname === ROUTES.HOME;
    const isWritePage = pathname.includes('/write');

    // 글쓰기 페이지에서는 WriteHeader를 사용
    if (isWritePage && writeStep) {
        return <WriteHeader currentStep={writeStep} />;
    }

    if (!isMobile && isHomePage) {
        return <IntroHeader />;
    }

    // 그 외 모든 경우 (모바일 전체 + 데스크톱 서브페이지)
    return (
        <div className={`${isMobile ? 'mobile-header' : ''} h-16`}>
            <BaseHeader />
        </div>
    );
}
