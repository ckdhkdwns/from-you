'use client';

import React, { useState } from 'react';
import BluredEval from '../_components/blured-eval';
import Image from 'next/image';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { findPassword } from '@/models/actions/user-actions';

export default function page() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('이메일을 입력해주세요.');
            return;
        }

        setIsLoading(true);

        try {
            await findPassword(email);
            toast.success('임시 비밀번호가 이메일로 전송되었습니다.');
            router.push('/login');
        } catch (error) {
            toast.error(error.message || '비밀번호 찾기에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col justify-center items-center space-y-6 relative max-w-[500px] mx-auto">
            <div className="absolute -top-[25%] left-0 w-full h-full overflow-visible z-0">
                <BluredEval />
            </div>
            <div className="flex flex-col items-center space-y-6 w-full z-10">
                <Image src="/logo.png" alt="logo" width={180} height={80} />
                <h1 className="text-2xl font-semibold">비밀번호 찾기</h1>
                <div className="text-gray-500 pb-4">가입시에 등록했던 이메일을 입력해주세요.</div>
                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="text-lg h-[70px] px-6 py-3 rounded-lg bg-primary-white border border-gray-100 w-full"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="text-lg flex flex-col justify-center h-[70px] gap-2.5 px-6 py-3 rounded-lg bg-primary-pink text-primary-black text-center w-full cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? '처리 중...' : '비밀번호 찾기'}
                    </button>
                </form>
            </div>
        </main>
    );
}
