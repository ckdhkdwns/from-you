'use client';

import React from 'react';
import Image from 'next/image';

interface SocialButtonProps {
    provider: string;
    color: string;
    textColor: string;
    iconSrc: string;
    iconSize: { width: number; height: number };
    text: string;
    onClick: () => void;
    isLoading: boolean;
}

export const SocialButton = ({
    provider,
    color,
    textColor,
    iconSrc,
    iconSize,
    text,
    onClick,
    isLoading,
}: SocialButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        className="w-full flex justify-center items-center h-[54px] rounded-xl"
        style={{ backgroundColor: color }}
        disabled={isLoading}
    >
        <div className="flex items-center gap-2">
            <Image
                src={iconSrc}
                alt={provider}
                width={iconSize.width}
                height={iconSize.height}
                priority
            />
            <p className={`text-base font-semibold ${textColor}`}>{text}</p>
        </div>
    </button>
);

export const SOCIAL_BUTTONS = [
    {
        provider: 'kakao',
        color: '#FEE500',
        hoverColor: '#FDD800',
        textColor: 'text-black',
        iconSrc: '/icons/socials/kakao.svg',
        iconSize: { width: 20, height: 18 },
        text: '카카오 로그인',
    },
    {
        provider: 'naver',
        color: '#03C75A',
        hoverColor: '#02B150',
        textColor: 'text-white',
        iconSrc: '/icons/socials/naver.svg',
        iconSize: { width: 14, height: 14 },
        text: '네이버 로그인',
    },
    {
        provider: 'apple',
        color: '#000000',
        hoverColor: '#333333',
        textColor: 'text-white',
        iconSrc: '/icons/socials/apple.svg',
        iconSize: { width: 16, height: 20 },
        text: 'Apple로 로그인',
    },
]; 