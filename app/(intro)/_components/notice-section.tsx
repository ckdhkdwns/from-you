'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import { NoticePublic } from '@/models/types/notice';
import { removeTableKeyPrefix } from '@/lib/api-utils';

export default function NoticeSection({ notices }: { notices: NoticePublic[] }) {
    const router = useRouter();

    return (
        <div
            className="w-full md:w-[60%] md:grid px-6 md:px-0"
            style={{ gridTemplateColumns: '1fr 2fr' }}
        >
            <div className="flex md:flex-col gap-2 items-end md:items-start mb-4 md:mb-0">
                <Image
                    src="/temp/event-phone.png"
                    alt="공지사항 이미지"
                    width={116}
                    height={150}
                    className="object-contain max-md:w-24 max-md:h-28 hidden md:block"
                />
                <p className="md:text-3xl text-2xl font-bold text-left">공지사항</p>
                <p className="md:text-base text-sm text-left text-gray-400">
                    프롬유의 공지사항입니다
                </p>
            </div>
            <div className="flex flex-col gap-2">
                {notices.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center w-full cursor-pointer group"
                        onClick={() =>
                            router.push(`/support/notice?id=${removeTableKeyPrefix(item.PK)}`)
                        }
                    >
                        <p className="text-base font-medium text-primary-black group-hover:underline">
                            {item.title}
                        </p>
                        <p className="text-sm font-normal text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
