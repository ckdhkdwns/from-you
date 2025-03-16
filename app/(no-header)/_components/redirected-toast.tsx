'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function RedirectedToast() {
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');

    useEffect(() => {
        if (redirect === 'true') {
            toast.warning('로그인 후 이용해주세요.');
        }
    }, [redirect]);

    return <></>;
}
