import ChannelTalk from '@/app/_channel-talk/channel-talk';
import React from 'react';
import BluredEval from '../_components/blured-eval';
import Link from 'next/link';
import Image from 'next/image';

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex min-h-screen flex-col justify-center items-center space-y-10 relative px-8">
            <ChannelTalk />
            <div className="absolute -top-[25%] left-0 w-full h-full overflow-visible z-0">
                <BluredEval />
            </div>

            <Link href="/" className="z-10">
                <Image src="/logo.png" alt="logo" width={180} height={80} />
            </Link>
            {children}
            <div className="h-32 md:h-64"></div>
        </main>
    );
}
