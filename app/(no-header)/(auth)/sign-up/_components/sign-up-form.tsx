'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createEmailUser } from '@/models/actions/user-actions';
import FormInput from '@/app/(no-header)/_components/form-input';
import FormButton from '@/app/(no-header)/_components/form-button';

export default function SignUpForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 로컬 유효성 검사
            if (!email || !password || !confirmPassword || !name) {
                setError('모든 필수 필드를 입력해주세요.');
                setIsLoading(false);
                return;
            }

            if (password !== confirmPassword) {
                setError('비밀번호가 일치하지 않습니다.');
                setIsLoading(false);
                return;
            }

            // 서버 액션 호출
            const result = await createEmailUser(email, password, name, undefined, phone);

            if (!result.success) {
                setError(result.error?.message || '회원가입 중 오류가 발생했습니다.');
                return;
            }

            router.push('/login');
            toast.success('회원가입이 완료되었습니다.');
        } catch (error) {
            console.error('회원가입 오류:', error);
            setError(error.message || '회원가입 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
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
                            onChange={e => setEmail(e.target.value)}
                            disabled={isLoading}
                        />

                        <FormInput
                            type="text"
                            placeholder="이름"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            disabled={isLoading}
                        />

                        <FormInput
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                        
                        <div className="text-sm -mt-2 pl-4 text-left font-medium text-gray-400">
                            (영문/숫자/특수문자 3가지 조합, 10~20자)
                        </div>
                        
                        <FormInput
                            type="password"
                            placeholder="비밀번호 확인"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                        />

                        <FormInput
                            type="tel"
                            placeholder="전화번호 (선택사항)"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <div className="flex justify-end items-center gap-3">
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => router.push('/login')}
                        >
                            <p className="text-sm">로그인으로 돌아가기</p>
                        </div>
                    </div>
                </div>

                <FormButton 
                    type="submit"
                    label={isLoading ? '처리 중...' : '회원가입'}
                    disabled={isLoading}
                    className="bg-[#f8d3d5]"
                />
            </div>
        </form>
    );
}
