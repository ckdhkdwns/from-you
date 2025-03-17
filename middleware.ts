import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// 로그인이 필요한 보호된 경로 정의
const protectedRoutes = ['/write', '/mypage', '/payment', '/profile'];

// 관리자 권한이 필요한 경로 정의
const adminOnlyRoutes = ['/admin'];

// 로그인 상태에서 접근할 필요가 없는 경로 (이미 로그인된 경우 홈으로 리다이렉트)
const authRoutes = ['/login', '/sign-up', '/find-password'];

export async function middleware(request: NextRequest) {
    // 현재 요청된 경로
    const path = request.nextUrl.pathname;
    
    // 미들웨어에서 처리해야 할 경로인지 확인
    const isAuthRoute = authRoutes.some(route => path.startsWith(route));
    const isAdminRoute = adminOnlyRoutes.some(route => path.startsWith(route));
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    
    // JWT 토큰으로 사용자 인증 정보 확인
    const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    });
    
    // 이미 로그인한 상태에서 로그인/회원가입 페이지 접근 시 홈으로 리다이렉트
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    
    // 보호된 경로에 미인증 상태로 접근 시 로그인 페이지로 리다이렉트
    if ((isAdminRoute || isProtectedRoute) && !token) {
        const redirectUrl = new URL('/login', request.url);
        
        // 현재 접근하려던 URL을 callbackUrl로 전달
        redirectUrl.searchParams.set('callbackUrl', request.url);
        redirectUrl.searchParams.set('redirect', 'true');
        
        return NextResponse.redirect(redirectUrl);
    }
    
    // 관리자 경로에 일반 사용자가 접근 시 홈으로 리다이렉트
    if (isAdminRoute && token && token.role !== 'admin') {
        // 접근 권한 없음 메시지를 표시하기 위한 파라미터 추가
        const redirectUrl = new URL('/', request.url);
        redirectUrl.searchParams.set('unauthorized', 'admin');
        
        return NextResponse.redirect(redirectUrl);
    }
    
    // 그 외 경로는 정상 처리
    return NextResponse.next();
}

// 미들웨어가 적용될 경로 정의 (성능 최적화를 위해 필요한 경로만 지정)
export const config = {
    matcher: [
        '/write/:path*',
        '/mypage/:path*',
        '/admin/:path*',
        '/payment/:path*',
        '/profile/:path*',
        '/login',
        '/sign-up',
        '/find-password',
    ],
};
