"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function LinearTabs({
    tabs,
    activeTab,
}: {
    tabs: {
        label: string;
        value: string;
        href?: string;
        onClick?: () => void;
    }[];
    activeTab: { label: string; value: string };
}) {
    const router = useRouter();

    return (
        <div className="flex gap-4 border-b border-gray-200 ">
            {tabs.map((tab) => (
                <div
                    key={tab.value}
                    className={`cursor-pointer 
                w-36
                pb-2
                relative
                font-semibold
                text-lg
                text-center
                ${activeTab.value === tab.value ? "" : "text-gray-400"}`}
                    onClick={() => {
                        if (tab.href) {
                            router.push(tab.href);
                            return;
                        }
                        if (tab.onClick) {
                            tab.onClick();
                        }
                    }}
                >
                    <div>{tab.label}</div>
                    {activeTab.value === tab.value && (
                        <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-secondary-newpink"></div>
                    )}
                </div>
            ))}
        </div>
    );
}
