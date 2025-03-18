'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { findPassword } from '@/models/actions/user-actions';
import BluredEval from '../../_components/blured-eval';
import FormInput from '@/app/(no-header)/_components/form-input';
import FormButton from '@/app/(no-header)/_components/form-button';

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
        <div className="z-10 flex flex-col items-center gap-10 w-full md:max-w-[400px]">
            <div className="flex flex-col items-center gap-2">
                <h1 className="text-2xl font-semibold">비밀번호 찾기</h1>
                <div className="text-gray-500 pb-4">가입시에 등록했던 이메일을 입력해주세요.</div>
            </div>
            <form onSubmit={handleSubmit} className="w-full space-y-6">
                <FormInput
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={isLoading}
                />
                <FormButton
                    type="submit"
                    label={isLoading ? '처리 중...' : '비밀번호 찾기'}
                    disabled={isLoading}
                    className=" text-primary-black"
                />
            </form>
        </div>
    );
}
