'use client';

import * as React from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { adminMenuGroups } from '../_constants/admin-menu-item';
import { usePathname } from 'next/navigation';
import { useCompleteLetters } from '../_contexts/complete-letters-provider';

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    const { hasNewLetters, newLettersCount, resetNewLettersNotification } = useCompleteLetters();

    // 메뉴 클릭 시 새 편지 알림 초기화
    const handleMenuClick = (url: string) => {
        // 편지 목록 페이지로 이동할 경우 알림 초기화
        if (url === '/admin/letters') {
            resetNewLettersNotification();
        }
    };

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                {/* <Image src="/logo.png" alt="logo" width={120} height={50} /> */}
            </SidebarHeader>
            <SidebarContent>
                {adminMenuGroups.map(group => (
                    <SidebarGroup key={group.groupName}>
                        {!group.hideGroupName && (
                            <div className="px-3 py-2">
                                <h3 className="text-xs font-medium text-muted-foreground">
                                    {group.groupName}
                                </h3>
                            </div>
                        )}
                        <SidebarMenu>
                            {group.items.map(item => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={item.url === pathname}
                                        className="data-[active=true]:bg-primary-pink/20 data-[active=true]:text-secondary-newpink
                                        !shadow-none data-[active=true]:font-semibold text-sm font-medium p-3 h-12 text-gray-500
                                        "
                                    >
                                        <a
                                            href={item.url}
                                            className="flex items-center gap-2"
                                            onClick={() => handleMenuClick(item.url)}
                                        >
                                            {/* {item.icon} */}
                                            {item.title}

                                            {/* 새 편지 알림 표시 */}
                                            {item.url === '/admin/letters' && hasNewLetters && (
                                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                                                    {newLettersCount > 99 ? '99+' : newLettersCount}
                                                </span>
                                            )}
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
