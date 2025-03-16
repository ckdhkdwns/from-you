import React from 'react';
import SupportTabsProvider from './_contexts/support-tabs-provider';
import SupportHeader from './_components/support-header';
import SupportTabs from './_components/support-tabs';

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <SupportTabsProvider>
            <div className="pt-12 container mx-auto flex flex-col gap-2">
                <div className="mb-6">
                    <SupportHeader />
                </div>
                {/* <Banner /> */}

                <SupportTabs />
                <div className="px-4">{children}</div>
            </div>
        </SupportTabsProvider>
    );
}
