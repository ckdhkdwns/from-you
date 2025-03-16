'use client';

import React, { useEffect } from 'react';
import { toast } from 'sonner';
import AccountAlert from './account-alert';
import { LetterPublic } from '@/models/types/letter';

interface AccountAlertToastProps {
    letter: LetterPublic;
}

export default function AccountAlertToast({ letter }: AccountAlertToastProps) {
    useEffect(() => {
        if (letter.paymentMethod === 'transfer' && letter.paymentStatus === 'pending') {
            toast(
                <div className="py-2">
                    <AccountAlert />
                </div>,
                {
                    duration: 1000000, // 10초 동안 표시
                    position: 'bottom-center',
                    closeButton: true,
                    classNames: {
                        closeButton: 'text-gray-500 !text-lg',
                    },
                    id: 'account-alert-toast', // 중복 방지를 위한 ID
                    className: 'w-full',
                },
            );
        }
    }, [letter]);

    return null;
}
