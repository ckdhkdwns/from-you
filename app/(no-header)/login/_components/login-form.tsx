'use client';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

const SOCIAL_BUTTONS = [
    {
        provider: 'kakao',
        color: '#FEE500',
        hoverColor: '#FDD800',
        textColor: 'text-black',
        iconSrc: '/icons/socials/kakao.svg',
        iconSize: { width: 20, height: 18 },
        text: '카카오 로그인',
    },
    {
        provider: 'naver',
        color: '#03C75A',
        hoverColor: '#02B150',
        textColor: 'text-white',
        iconSrc: '/icons/socials/naver.svg',
        iconSize: { width: 14, height: 14 },
        text: '네이버 로그인',
    },
    {
        provider: 'apple',
        color: '#000000',
        hoverColor: '#333333',
        textColor: 'text-white',
        iconSrc: '/icons/socials/apple.svg',
        iconSize: { width: 16, height: 20 },
        text: 'Apple로 로그인',
    },
];

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!email || !password) {
                setError('이메일과 비밀번호를 입력해주세요.');
                setIsLoading(false);
                return;
            }

            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            console.log('로그인 결과:', result);

            if (result?.error) {
                setError('이메일 또는 비밀번호가 일치하지 않습니다.');
                return;
            }

            toast.success('로그인에 성공했습니다.');
            router.push('/');
        } catch (error) {
            console.error('로그인 오류:', error);
            setError('로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="z-10">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center w-[312px] md:w-[400px] gap-6"
            >
                <div className="flex flex-col items-center gap-8 w-full">
                    <div className="flex flex-col gap-3 w-full">
                        <div className="flex flex-col gap-6 w-full">
                            <div className="p-4 rounded-[10px] bg-white border border-[#e0e0e0]">
                                <div className="flex items-center">
                                    <input
                                        type="email"
                                        placeholder="이메일"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full text-base bg-transparent border-none outline-none"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <div className="p-4 rounded-[10px] bg-white border border-[#e0e0e0]">
                                <div className="flex items-center">
                                    <input
                                        type="password"
                                        placeholder="비밀번호"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full text-base bg-transparent border-none outline-none"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && <div className="text-red-500 text-sm">{error}</div>}

                        <div className="flex justify-end items-center gap-3">
                            <div
                                className="flex items-center cursor-pointer"
                                onClick={() => router.push('/find-password')}
                            >
                                <p className="text-sm text-[#8c8c8c]">비밀번호 찾기</p>
                            </div>
                            <div className="w-[1px] h-3 bg-[#D9D9D9]"></div>
                            <div
                                className="flex items-center cursor-pointer"
                                onClick={() => router.push('/sign-up')}
                            >
                                <p className="text-sm text-[#8c8c8c]">회원가입</p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center items-center px-6 py-4 rounded-xl bg-[#f8d3d5] active:bg-[#f8d3d5]/70 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        <p className="text-lg font-medium text-[#333]">
                            {isLoading ? '로그인 중...' : '로그인'}
                        </p>
                    </button>
                </div>

                <div className="flex flex-col items-center gap-8 w-full">
                    <div className="flex items-center gap-3 justify-center w-full">
                        <Separator className="w-[66px] md:w-[80px]" />
                        <p className="text-base text-gray-450 whitespace-nowrap">
                            소셜 아이디로 간편 로그인
                        </p>
                        <Separator className="w-[66px] md:w-[80px]" />
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                        {SOCIAL_BUTTONS.map(button => (
                            <button
                                key={button.provider}
                                type="button"
                                onClick={() =>
                                    signIn(button.provider, {
                                        callbackUrl: '/',
                                    })
                                }
                                className="w-full flex justify-center items-center h-[54px] rounded-xl"
                                style={{ backgroundColor: button.color }}
                                disabled={isLoading}
                            >
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={button.iconSrc}
                                        alt={button.provider}
                                        width={button.iconSize.width}
                                        height={button.iconSize.height}
                                    />
                                    <p className={`text-base font-semibold ${button.textColor}`}>
                                        {button.text}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    );
}
