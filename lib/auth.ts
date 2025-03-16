/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import KakaoProvider from 'next-auth/providers/kakao';
import NaverProvider from 'next-auth/providers/naver';
import AppleProvider from 'next-auth/providers/apple';

import { verifyCredentials, handleSocialLogin } from '@/models/actions/user-actions';
import { getServerSession } from 'next-auth';
import { Provider } from '@/models/types/user';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name?: string;
            provider: Provider;
            point?: number;
            createdAt?: string;
            role?: string;
        };
    }

    interface JWT {
        id: string;
        name?: string;
        provider: Provider;
        point?: number;
        createdAt?: string;
        role?: string;
    }
}

/**
 * 현재 세션의 사용자 ID를 반환
 */
export const getUserIdBySession = async () => {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error('로그인이 필요합니다.');
    }
    return session.user.id;
};

export const authOptions: NextAuthOptions = {
    cookies: {
        pkceCodeVerifier: {
            name: 'next-auth.pkce.code_verifier',
            options: {
                httpOnly: true,
                sameSite: 'none',
                path: '/',
                secure: true,
            },
        },
    },
    providers: [
        CredentialsProvider({
            name: '이메일',
            credentials: {
                email: { label: '이메일', type: 'email' },
                password: { label: '비밀번호', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const { data: user, error } = await verifyCredentials(
                        credentials.email,
                        credentials.password,
                    );

                    if (error) {
                        throw new Error(error.message);
                    }

                    return {
                        id: user.email,
                        name: user.name,
                        provider: user.provider,
                        point: user.point,
                        createdAt: user.createdAt,
                        role: (user as any).role || 'user',
                    };
                } catch (error) {
                    console.error('로그인 인증 오류:', error);
                    return null;
                }
            },
        }),
        AppleProvider({
            clientId: process.env.APPLE_SERVICE_ID,
            clientSecret: process.env.APPLE_SECRET,
            profile: profile => {
                console.log(profile);
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: null,
                };
            },
        }),
        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID || '',
            clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
        }),
        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID || '',
            clientSecret: process.env.NAVER_CLIENT_SECRET || '',
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            try {
                if (account?.provider === 'credentials') {
                    return true;
                }

                const provider = account?.provider;
                const providerId = account?.providerAccountId;

                if (!provider || !providerId) {
                    throw new Error('로그인 정보를 가져올 수 없습니다.');
                }

                // 소셜 로그인 시 역할 정보 추가
                (user as any).role = 'user'; // 소셜 로그인 사용자의 기본 역할 설정

                await handleSocialLogin(
                    provider as Extract<Provider, 'kakao' | 'naver' | 'apple'>,
                    providerId,
                    user.email,
                    user.name,
                );

                return true;
            } catch (error) {
                console.error('SignIn error:', error);
                return false;
            }
        },
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    ...user,
                    role: (user as any).role || 'user',
                };
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                id: token.id as string,
                name: token.name as string,
                provider: token.provider as Provider,
                point: token.point as number,
                createdAt: token.createdAt as string,
                role: token.role as string,
            };
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login/error',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30일
    },
    secret: process.env.NEXTAUTH_SECRET,
};

// NextAuth 헬퍼 함수 추가
export const auth = async () => getServerSession(authOptions);
