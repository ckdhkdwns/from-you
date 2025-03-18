'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { signInEmail } from '@/lib/auth';
import { SocialButton, SOCIAL_BUTTONS } from './social-button';
import FormInput from '@/app/(no-header)/_components/form-input';
import FormButton from '@/app/(no-header)/_components/form-button';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!email || !password) {
                setIsLoading(false);
                setError('이메일과 비밀번호를 입력해주세요.');
                return;
            }

            const error = await signInEmail(email, password);
            if (error) {
                setError(error);
                return;
            }
            router.push('/');
        } catch (error) {
            console.error('로그인 오류:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        setIsLoading(true);
        signIn(provider, {
            callbackUrl,
            redirect: true,
        }).catch(error => {
            console.error(`${provider} 로그인 오류:`, error);
            setIsLoading(false);
            toast.error(`${provider} 로그인 중 오류가 발생했습니다.`);
        });
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setError('');
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError('');
    };

    const handleFindPassword = () => {
        router.push('/find-password');
    };

    const handleSignUp = () => {
        router.push('/sign-up');
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center w-full md:max-w-[400px] gap-6 z-10"
        >
            <div className="flex flex-col items-center gap-8 w-full">
                <div className="flex flex-col gap-3 w-full">
                    <div className="flex flex-col gap-6 w-full">
                        <FormInput
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={handleEmailChange}
                            disabled={isLoading}
                        />
                        <FormInput
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={handlePasswordChange}
                            disabled={isLoading}
                        />
                    </div>

                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <div className="flex justify-end items-center gap-3">
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={handleFindPassword}
                        >
                            <p className="text-sm text-gray-400">비밀번호 찾기</p>
                        </div>
                        <div className="w-[1px] h-3 bg-gray-300"></div>
                        <div className="flex items-center cursor-pointer" onClick={handleSignUp}>
                            <p className="text-sm text-gray-400">회원가입</p>
                        </div>
                    </div>
                </div>

                <FormButton
                    type="submit"
                    label={isLoading ? '로그인 중...' : '로그인'}
                    disabled={isLoading}
                />
            </div>

            <div className="flex flex-col items-center gap-8 w-full">
                <div className="flex items-center gap-3 justify-center w-full">
                    <Separator className="w-[66px] md:w-[80px]" />
                    <p className="text-sm text-gray-400 whitespace-nowrap">
                        소셜 아이디로 간편 로그인
                    </p>
                    <Separator className="w-[66px] md:w-[80px]" />
                </div>

                <div className="flex flex-col gap-3 w-full">
                    {SOCIAL_BUTTONS.map(button => (
                        <SocialButton
                            key={button.provider}
                            {...button}
                            onClick={() => handleSocialLogin(button.provider)}
                            isLoading={isLoading}
                        />
                    ))}
                </div>
            </div>
        </form>
    );
}
