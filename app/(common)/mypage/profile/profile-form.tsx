'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateUserProfile, withdrawUser } from '@/models/actions/user-actions';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';
import { UserInput, UserPublic } from '@/models/types/user';

type ProfileField = {
    label: string;
    name: string;
    type: string;
    value: string;
    hide?: boolean;
    placeholder?: string;
    readOnly?: boolean;
};

interface ProfileFormProps {
    initialUserData: UserPublic;
}

export default function ProfileForm({ initialUserData }: ProfileFormProps) {
    const [formData, setFormData] = useState({
        name: initialUserData?.name || '',
        password: '',
        passwordConfirm: '',
        phone: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [withdrawConfirmText, setWithdrawConfirmText] = useState('');
    const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setFormData({
            name: initialUserData?.name || '',
            password: '',
            passwordConfirm: '',
            phone: initialUserData?.phone || '',
        });
    }, [initialUserData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const validatePassword = (password: string) => {
        // 영문 + 숫자 + 특수문자 10~20자리 검증
        const passwordSchema = z
            .string()
            .min(10, '비밀번호는 최소 10자 이상이어야 합니다.')
            .max(20, '비밀번호는 최대 20자까지 가능합니다.')
            .regex(
                /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{10,20}$/,
                '비밀번호는 영문, 숫자, 특수문자 3가지 조합으로 10~20자여야 합니다.',
            );

        try {
            passwordSchema.parse(password);
            return { valid: true, message: '' };
        } catch (error) {
            if (error instanceof z.ZodError) {
                return { valid: false, message: error.errors[0].message };
            }
            return {
                valid: false,
                message: '비밀번호 형식이 올바르지 않습니다.',
            };
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 이름 검증
        if (!formData.name.trim()) {
            toast.error('이름을 입력해주세요.');
            return;
        }

        // 비밀번호 변경 시 검증 (이메일 로그인인 경우만)
        if (initialUserData?.provider === 'email' && formData.password) {
            // 비밀번호 형식 검증
            const passwordValidation = validatePassword(formData.password);
            if (!passwordValidation.valid) {
                toast.error(passwordValidation.message);
                return;
            }

            // 비밀번호 확인 일치 검증
            if (formData.password !== formData.passwordConfirm) {
                toast.error('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const updateData: UserInput = {
                email: initialUserData.email,
                name: formData.name,
                provider: initialUserData.provider,
            };

            // 비밀번호가 입력된 경우에만 업데이트 데이터에 포함
            if (initialUserData?.provider === 'email' && formData.password) {
                updateData.password = formData.password;
            }

            await updateUserProfile(updateData);

            toast.success('회원 정보가 성공적으로 수정되었습니다.');

            // 비밀번호 필드 초기화
            setFormData(prev => ({
                ...prev,
                password: '',
                passwordConfirm: '',
            }));
        } catch (error) {
            console.error('프로필 업데이트 오류:', error);
            toast.error('회원 정보 수정에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 회원탈퇴 처리 함수
    const handleWithdraw = async () => {
        if (withdrawConfirmText !== '회원탈퇴') {
            toast.error("'회원탈퇴'를 정확히 입력해주세요.");
            return;
        }

        setIsWithdrawing(true);

        try {
            // 회원탈퇴 서버 액션 호출
            const result = await withdrawUser();

            if (result.success) {
                // 로그아웃 처리
                await signOut({ redirect: false });

                // 성공 메시지 표시
                toast.success('회원탈퇴가 완료되었습니다.');

                // 홈페이지로 리다이렉트
                router.push('/');
            } else {
                throw new Error('회원탈퇴에 실패했습니다.');
            }
        } catch (error) {
            console.error('회원탈퇴 오류:', error);
            toast.error(error instanceof Error ? error.message : '회원탈퇴에 실패했습니다.');
        } finally {
            setIsWithdrawing(false);
            setShowWithdrawDialog(false);
        }
    };

    const profileFields: ProfileField[] = [
        {
            label: '이메일',
            name: 'email',
            type: 'text',
            value: initialUserData?.email || '',
            readOnly: true,
            hide: initialUserData?.provider !== 'email',
        },
        {
            label: '소셜 계정',
            name: 'socialAccount',
            type: 'text',
            value:
                initialUserData?.provider === 'kakao'
                    ? '카카오 계정으로 로그인'
                    : initialUserData?.provider === 'naver'
                      ? '네이버 계정으로 로그인'
                      : initialUserData?.provider === 'apple'
                        ? '애플 계정으로 로그인'
                        : '',
            readOnly: true,
            hide: initialUserData?.provider === 'email',
        },
        {
            label: '비밀번호',
            name: 'password',
            type: 'password',
            value: formData.password,
            placeholder: '영문/숫자/특수문자 세가지 이상 조합, 10~20자',
            hide: initialUserData?.provider !== 'email',
        },
        {
            label: '비밀번호 확인',
            name: 'passwordConfirm',
            type: 'password',
            value: formData.passwordConfirm,
            placeholder: '',
            hide: initialUserData?.provider !== 'email',
        },
        {
            label: '휴대폰 번호',
            name: 'phone',
            type: 'text',
            value: formData.phone,
            placeholder: '',
        },
        {
            label: '이름',
            name: 'name',
            type: 'text',
            value: formData.name,
        },
    ];

    // 표시할 필드 필터링
    const fieldsToDisplay = profileFields.filter(field => !field.hide);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                    {fieldsToDisplay.map((field, index) => (
                        <div key={index} className="pb-6">
                            <div className="md:grid md:grid-cols-[120px,1fr] gap-4 items-center">
                                <span className="text-gray-400 text-sm">{field.label}</span>
                                <Input
                                    type={field.type}
                                    name={field.name}
                                    value={field.value}
                                    placeholder={field.placeholder}
                                    disabled={field.readOnly}
                                    onChange={handleChange}
                                    className={field.readOnly ? 'bg-gray-100' : ''}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-center">
                    <Button type="submit" disabled={isSubmitting} size="lg">
                        {isSubmitting ? '저장 중...' : '저장하기'}
                    </Button>
                </div>
            </form>

            <div className="mt-8 flex justify-center">
                <ResponsiveDialog
                    open={showWithdrawDialog}
                    onOpenChange={setShowWithdrawDialog}
                    title="회원 탈퇴"
                    description="회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다."
                    contentClassName="sm:max-w-[425px] !bg-white"
                    triggerContent={
                        <Button variant="link" className="text-gray-400 hover:text-red-500">
                            회원 탈퇴
                        </Button>
                    }
                >
                    <div className="py-4">
                        <p className="text-sm text-gray-500 mb-2">
                            탈퇴를 진행하려면 아래에 &apos;회원탈퇴&apos;를 입력해주세요.
                        </p>
                        <Input
                            value={withdrawConfirmText}
                            onChange={e => setWithdrawConfirmText(e.target.value)}
                            placeholder="회원탈퇴"
                            className="mt-2 "
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1 mt-4 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowWithdrawDialog(false)}
                            className="w-full sm:w-auto h-12"
                        >
                            취소
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleWithdraw}
                            disabled={isWithdrawing || withdrawConfirmText !== '회원탈퇴'}
                            className="w-full sm:w-auto h-12"
                        >
                            {isWithdrawing ? '처리 중...' : '탈퇴하기'}
                        </Button>
                    </div>
                </ResponsiveDialog>
            </div>
        </>
    );
}
