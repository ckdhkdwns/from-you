'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import React from 'react';
import { adminMenuItems } from '../_constants/admin-menu-item';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';

export default function AdminHeader() {
    const pathname = usePathname();
    const menuItem =
        adminMenuItems.find(item => item.url === pathname) ||
        adminMenuItems.find(item => pathname.includes(item.url));

    return (
        <header className="flex flex-col gap-1 px-4 py-4 border-b">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />

                {menuItem && (
                    <div>
                        <Breadcrumb>
                            <BreadcrumbList>
                                {menuItem.groupName && (
                                    <>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href="/admin">
                                                {menuItem.groupName}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                    </>
                                )}
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{menuItem.title}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        {/* <h1 className="text-2xl font-bold mt-4">
                                {menuItem?.title}
                            </h1>
                            <div className="mb-5 text-sm text-muted-foreground">
                                {menuItem?.description}
                            </div> */}
                    </div>
                )}
            </div>
            {/* {actions && actions.length > 0 && (
                    <div className="flex items-center gap-2">
                        {actions.map((action, index) => (
                            <React.Fragment key={index}>
                                {action}
                            </React.Fragment>
                        ))}
                    </div>
                )} */}
        </header>
    );
}
