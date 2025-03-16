import React from 'react';
import { AdminSidebar } from './_components/admin-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AdminHeader from './_components/admin-header';
import CompleteLettersProvider from './_contexts/complete-letters-provider';

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <CompleteLettersProvider>
                <AdminSidebar />
                <SidebarInset className="bg-white">
                    <AdminHeader />
                    {children}
                </SidebarInset>
            </CompleteLettersProvider>
        </SidebarProvider>
    );
}
