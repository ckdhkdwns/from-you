'use client';

import { Separator } from '@/components/ui/separator';
import { User, Send, Mail } from 'react-feather';
import Image from 'next/image';
import { useUserData } from '@/contexts/session';
import { useMyLetters } from '../../_contexts/my-letters-provider';
import TextLoader from '@/components/ui/text-loader';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import StatItem from './stat-item';

type StatCard = {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    description?: string;
    underline?: boolean;
    href?: string;
    mobileHide?: boolean;
};

type LetterStat = {
    value: number;
    label: string;
    href?: string;
};

export default function MyPageClient() {
    const { userData } = useUserData();
    const { letterCount } = useMyLetters();
    const isMobile = useIsMobile();
    const router = useRouter();

    if (!userData || !letterCount) {
        return <TextLoader text="불러오는 중..." className="h-full" />;
    }

    const strokeWidth = isMobile ? 1.5 : 1;
    const stats: StatCard[] = [
        {
            icon: <User className="w-8 h-8 md:w-11 md:h-11" strokeWidth={strokeWidth} />,
            value: userData?.name || '사용자명',
            label:
                userData?.provider === 'kakao'
                    ? '카카오 계정 사용 중'
                    : userData?.provider === 'naver'
                      ? '네이버 계정 사용 중'
                      : userData?.provider === 'apple'
                        ? '애플 계정 사용 중'
                        : userData?.id || 'email@address.com',
            underline: true,
            mobileHide: true,
        },
        {
            icon: (
                <Image
                    src="/icons/point.svg"
                    alt="point"
                    width={24}
                    height={24}
                    className="md:w-11 md:h-11"
                />
            ),
            value: `${userData?.point.toLocaleString()} P`,
            label: '보유 포인트',
        },
        {
            icon: <Send className="w-6 h-6 md:w-8 md:h-8" strokeWidth={strokeWidth} />,
            value: letterCount.sent,
            label: '보낸 편지',
            href: '/mypage/letters/sent',
        },
        {
            icon: <Mail className="w-6 h-6 md:w-8 md:h-8" strokeWidth={strokeWidth} />,
            value: letterCount.received,
            label: '받은 편지',
            href: '/mypage/letters/received',
        },
    ];

    const letterStats: LetterStat[] = [
        {
            value: letterCount.sent,
            label: '접수 완료',
            href: '/mypage/letters/sent',
        },
        {
            value: letterCount.received,
            label: '접수중',
            href: '/mypage/letters/sent',
        },
        {
            value: letterCount.draft,
            label: '임시저장',
            href: '/mypage/letters/draft',
        },
    ];

    const filteredStats = stats.filter(stat => (isMobile ? !stat.mobileHide : true));

    return (
        <div className="pt-16">
            {isMobile && (
                <div className="pb-8">
                    <StatItem stat={stats[0]} index={0} stats={stats.slice(0, 1)} />
                </div>
            )}
            <Separator className="bg-primary-black h-[2px] mb-6 md:mb-10" />
            <div className="flex mb-8">
                {filteredStats.map((stat, index) => (
                    <StatItem key={index} stat={stat} index={index} stats={filteredStats} />
                ))}
            </div>
            <Separator className="bg-gray-200 h-[1px] mb-16" />

            <div className="mt-12">
                <div className="flex gap-4 items-center mb-5">
                    <h2 className="text-lg font-semibold">보낸 편지 내역</h2>
                    <div className="text-gray-400 text-sm font-normal">
                        (최근 <span className="text-primary-black">3개월</span> 기준)
                    </div>
                </div>
                <Separator className="bg-primary-black h-[2px] mb-8" />

                <div className="flex">
                    {letterStats.map((stat, index) => (
                        <div 
                            key={index}
                            className={cn(
                                'w-full flex items-center',
                                stat.href && 'cursor-pointer',
                            )}
                            onClick={() => {
                                if (stat.href) {
                                    router.push(stat.href);
                                }
                            }}
                        >
                            <div className="flex flex-col items-center justify-center w-full">
                                <div className="text-2xl font-bold mb-2">{stat.value}</div>
                                <div className="text-sm text-gray-400">{stat.label}</div>
                            </div>
                            {index !== letterStats.length - 1 && (
                                <div className="w-[1.5px] h-11 bg-gray-200"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
