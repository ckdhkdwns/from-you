'use client';

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { EMOJI_CATEGORIES } from '@/constants';

export default function PickEmojiButton() {
    const handleEmojiSelect = (emoji: string) => {
        // 이모지 선택 시 처리할 로직
        console.log(emoji);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="cursor-pointer">
                    <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 relative"
                    >
                        <path
                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                            stroke="#333333"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14"
                            stroke="#333333"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M9 9H9.01"
                            stroke="#333333"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M15 9H15.01"
                            stroke="#333333"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-3 bg-primary-ivory">
                <Tabs defaultValue="자주 사용" className="w-full">
                    <ScrollArea className="w-full">
                        <TabsList className="w-full inline-flex h-auto flex-wrap justify-start bg-transparent">
                            {Object.keys(EMOJI_CATEGORIES).map(category => (
                                <TabsTrigger key={category} value={category} className="text-sm">
                                    {category}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </ScrollArea>
                    <Separator className="my-2" />
                    {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                        <TabsContent key={category} value={category} className="mt-2">
                            <ScrollArea className="h-[200px]">
                                <div className="grid grid-cols-8 gap-1">
                                    {emojis.map((emoji, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleEmojiSelect(emoji)}
                                            className="p-1 hover:bg-gray-100 rounded text-xl"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    ))}
                </Tabs>
            </PopoverContent>
        </Popover>
    );
}
