import React from 'react';
import Sidebar from './(default)/_components/sidebar';

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col-reverse md:flex-row container mx-auto px-4 md:px-6 gap-6 pb-12">
            <Sidebar />
            <main className="flex-1">{children}</main>
        </div>
    );
}
