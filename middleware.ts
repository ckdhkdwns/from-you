import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedRoutes = ['/write', '/mypage', '/payment', '/profile'];
const adminOnlyRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
    const isAdminRoute = adminOnlyRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route),
    );

    if (isAdminRoute || isProtectedRoute) {
        const token = await getToken({ req: request });
        console.log('token', token);

        if (!token) {
            const redirectUrl = new URL('/login', request.url);
            redirectUrl.searchParams.set('callbackUrl', request.url);
            redirectUrl.searchParams.set('redirect', 'true');
            return NextResponse.redirect(redirectUrl);
        }

        if (isAdminRoute && token.role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/write/:path*',
        '/mypage/:path*',
        '/admin/:path*',
        '/payment/:path*',
        '/profile/:path*',
    ],
};
