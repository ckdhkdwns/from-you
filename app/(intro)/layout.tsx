import React from 'react';
import TopBanner from './_components/top-banner';
import NewHeader from '@/components/new-header';
import Footer from '@/components/footer/footer';
import { PopupDisplay } from '@/components/popup/popup-display';

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="">
            <div className="flex flex-col min-h-screen bg-primary-ivory container mx-auto relative px-2 !p-0">
                <NewHeader />

                <div className="p-2">
                    <TopBanner />
                </div>
                <div className="mx-auto w-full">{children}</div>
                <Footer />

                <PopupDisplay />
            </div>
        </div>
    );
}
