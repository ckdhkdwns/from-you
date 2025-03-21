import type { Metadata, Viewport } from 'next';
import './globals.css';
import './font.css';
import AuthSession from '@/contexts/session';
import { Toaster } from '@/components/ui/sonner';
import { ConfirmProvider } from '@/contexts/confirm-provider';
import Script from 'next/script';

export const metadata: Metadata = {
    title: '프롬유',
    description: '멀리 있어도, 마음은 가까이',
    openGraph: {
        title: '프롬유',
        description: '멀리 있어도, 마음은 가까이',
        images: [
            {
                url: 'https://fromyou.co.kr/logo-with-background.png?v=1',
                width: 820,
                height: 410,
                alt: '프롬유 로고',
            },
        ],
        url: 'https://fromyou.co.kr',
        locale: 'ko',
        type: 'website',
    },
    icons: {
        icon: [
            { url: '/favicons/favicon.ico' },
            {
                url: '/favicons/favicon-16x16.png',
                sizes: '16x16',
                type: 'image/png',
            },
            {
                url: '/favicons/favicon-32x32.png',
                sizes: '32x32',
                type: 'image/png',
            },
        ],
        apple: [{ url: '/favicons/apple-touch-icon.png' }],
    },
    manifest: '/favicons/site.webmanifest',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
};
// const pretendard = localFont({
//     src: [{ path: "../assets/fonts/PretendardVariable.woff2", weight: "45 920" }],
//     // display: "swap",
//     // weight: "45 920",
// });

// 모든 페이지에 대한 전역 설정
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html className="h-full">
            <head>
                <link
                    rel="stylesheet"
                    as="style"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
                />

                <Script src="//wcs.naver.net/wcslog.js" strategy="beforeInteractive" />
                <Script strategy="lazyOnload">
                    {`if(!wcs_add) var wcs_add = {};
wcs_add["wa"] = "10b316bdd17b2e0";
if(window.wcs) {
wcs_do();
}`}
                </Script>
            </head>

            <body
                style={{ fontFamily: 'Pretendard Variable' }}
                className={`antialiased text-primary-black font-medium overflow-y-auto`}
            >
                <AuthSession>
                    <ConfirmProvider>
                        {children}
                        <Toaster />
                    </ConfirmProvider>
                </AuthSession>
            </body>
        </html>
    );
}
