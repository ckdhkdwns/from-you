import { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    reactStrictMode: false,
    webpack: config => {
        config.cache = false;
        config.resolve.fallback = { fs: false };
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
    images: {
        minimumCacheTTL: 86400,
        remotePatterns: [
            {
                hostname: '**',
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
        dirs: ['app', 'components', 'hooks', 'lib', 'models', 'services'],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    // 모든 페이지에 대해 동적 렌더링 설정
    staticPageGenerationTimeout: 1000,
    output: 'standalone',
    generateEtags: false,
};

export default nextConfig;
