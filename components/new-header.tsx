"use client";

import React from "react";
import { usePathname } from "next/navigation";
import IntroHeader from "./headers/intro-header";
import Header from "./header";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * 반응형 헤더 컴포넌트
 * - 모바일: 모든 페이지에서 기본 헤더 표시
 * - 데스크톱: 홈페이지('/')에서는 인트로 헤더, 다른 페이지에서는 기본 헤더 표시
 */
export default function NewHeader() {
    const pathname = usePathname();
    const isMobile = useIsMobile();
    const isHomePage = pathname === "/";
    
    // 홈페이지 데스크톱에서만 인트로 헤더 표시
    if (!isMobile && isHomePage) {
        return <IntroHeader />;
    }
    
    // 그 외 모든 경우 (모바일 전체 + 데스크톱 서브페이지)
    return (
        <div className={`${isMobile ? 'mobile-header' : ''} h-16`}>
            <Header />
        </div>
    );
}
