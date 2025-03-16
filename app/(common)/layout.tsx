import Footer from '@/components/footer/footer';
import NewHeader from '@/components/new-header';
import React from 'react';

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-primary-pink">
            <div className="flex flex-col min-h-screen bg-primary-ivory container mx-auto relative px-2 md:px-6 shadow-md">
                <NewHeader />
                <div className="w-full mx-auto">{children}</div>
                <Footer />
            </div>
        </div>
    );
}
