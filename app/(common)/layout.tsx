import Footer from '@/components/footer/footer';
import Header from '@/components/header';
import React from 'react';
import ChannelTalk from '../_channel-talk/channel-talk';

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-primary-pink">
            <div className="flex flex-col min-h-screen bg-primary-ivory container mx-auto relative px-2 md:px-6 shadow-md">
                <Header />
                <div className="w-full mx-auto">{children}</div>
                <Footer />
                <ChannelTalk />
            </div>
        </div>
    );
}
