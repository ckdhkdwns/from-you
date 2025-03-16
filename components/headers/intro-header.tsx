'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { useUserData } from '@/contexts/session';

export default function IntroHeader() {
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

    const menuItems = userData?.id ? userMenuItems : guestMenuItems;

    const handleLogout = async () => {
        await signOut({ redirect: false });
        toast.info('로그아웃 되었습니다.');
        router.push('/');
    };

    const handleMenuItemClick = (item: { label: string; path?: string; action?: () => void }) => {
        if (item.action) {
            item.action();
        } else {
            router.push(item.path);
        }
    };
    return (
        <div
            className="fixed z-[999] transition-all duration-300"
            style={{
                top: isMounted ? headerPosition : 0,
                left: 'max(calc(50% - 530px), 40px)',
            }}
        >
            <div
                className="w-[230px] h-[190px] rounded-bl-sm rounded-br-sm bg-primary-ivory flex flex-col justify-between"
                style={{
                    boxShadow: '0px 2px 6px 0 rgba(0,0,0,0.25)',
                }}
            >
                <div className="flex flex-col items-center justify-center mt-4">
                    <img
                        src="/logo.png"
                        className="w-[168px] h-[74px]  object-cover cursor-pointer"
                        onClick={() => router.push('/')}
                    />
                    <p className="text-sm font-semibold text-left text-gray-500">
                        {userData?.id
                            ? `${userData.name}님 환영합니다!`
                            : '로그인하고 편지를 작성해보세요!'}
                    </p>
                </div>
                <div className="flex justify-between items-center w-full p-[32px]">
                    <DropdownMenu modal={false}>
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
                            style={{
                                boxShadow: '0px 2px 20px 0 rgba(0,0,0,0.1)',
                            }}
                        >
                            <div className="flex flex-col justify-center items-center gap-4">
                                <div
                                    className="rounded-bl-sm rounded-br-sm border-t-0 border-r border-b border-l border-[#b0bda6] w-full flex flex-col justify-center items-center pt-6 pb-2"
                                    style={
                                        {
                                            // filter: "drop-shadow(0px 2px 6px rgba(0,0,0,0.25))",
                                        }
                                    }
                                >
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
