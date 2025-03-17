'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function UnauthorizedToast() {
    const searchParams = useSearchParams();
    const [hasShownToast, setHasShownToast] = useState(false);
    
    // URL에서 unauthorized 파라미터 추출
    const unauthorized = searchParams.get('unauthorized');
    
    useEffect(() => {
        if (hasShownToast || !unauthorized) {
            return;
        }
        
        // 권한에 따른 메시지 표시
        if (unauthorized === 'admin') {
            toast.error('관리자 권한이 필요한 페이지입니다.');
        } else {
            toast.error('접근 권한이 없습니다.');
        }
        
        // 토스트 표시 상태 저장
        setHasShownToast(true);
    }, [unauthorized, hasShownToast]);

    return <></>;
} 