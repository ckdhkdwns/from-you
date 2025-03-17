'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function RedirectedToast() {
    const searchParams = useSearchParams();
    const [hasShownToast, setHasShownToast] = useState(false);
    
    // URL에서 파라미터 추출
    const redirect = searchParams.get('redirect');
    const callbackUrl = searchParams.get('callbackUrl');
    
    useEffect(() => {
        // 토스트가 이미 표시되었거나 redirect 파라미터가 없는 경우 처리하지 않음
        if (hasShownToast || redirect !== 'true') {
            return;
        }
        
        // 접근하려던 페이지 정보 추출
        let targetPageInfo = '';
        if (callbackUrl) {
            try {
                const url = new URL(callbackUrl, window.location.origin);
                const path = url.pathname;
                
                // 페이지별 메시지 설정
                const pageMessages: Record<string, string> = {
                    '/write': '편지 작성을',
                    '/mypage': '마이페이지를',
                    '/payment': '결제를',
                    '/profile': '프로필을',
                    '/admin': '관리자 페이지를',
                };
                
                // 경로에 따른 특별 메시지 또는 기본 메시지 사용
                for (const [prefix, message] of Object.entries(pageMessages)) {
                    if (path.startsWith(prefix)) {
                        targetPageInfo = ` ${message}`;
                        break;
                    }
                }
            } catch (e) {
                console.error('Invalid callbackUrl:', e);
            }
        }
        
        // 특정 페이지에 대한 정보가 있으면 해당 정보를 포함한 메시지 표시
        if (targetPageInfo) {
            toast.warning(`${targetPageInfo} 이용하려면 로그인이 필요합니다.`);
        } else {
            toast.warning('로그인 후 이용해주세요.');
        }
        
        // 토스트 표시 상태 저장
        setHasShownToast(true);
    }, [redirect, callbackUrl, hasShownToast]);

    return <></>;
}
