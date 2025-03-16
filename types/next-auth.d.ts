import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            provider: 'email' | 'kakao' | 'naver' | 'apple';
            role: 'user' | 'admin';
        };
    }
}
