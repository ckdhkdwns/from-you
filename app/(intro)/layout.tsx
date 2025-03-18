import React from 'react';
import TopBanner from './_components/top-banner';
import Header from '@/components/header';
import Footer from '@/components/footer/footer';
import { PopupDisplay } from '@/components/popup/popup-display';
import ChannelTalk from '../_channel-talk/channel-talk';

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-primary-ivory">
            <div className="px-2 mt-20 md:mt-0">
                <TopBanner />
            </div>
            <div className="flex flex-col min-h-screen bg-primary-ivory container mx-auto relative px-2 !p-0">
                <Header />

                <div className="mx-auto w-full">{children}</div>
                <Footer />
                <ChannelTalk />
                <PopupDisplay />
            </div>
        </div>
    );
}
