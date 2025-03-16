'use client';

import { useEffect, useState } from 'react';

import { ResponsiveDialog } from '@/components/ui/responsive-dialog';

import React from 'react';
import Image from 'next/image';
import { CheckIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, Search } from 'react-feather';
import { FONT_LIST } from '@/constants';

export default function FontFamilySelect({
    onValueChange,
    value,
}: {
    onValueChange: (_value: string) => void;
    value: string;
}) {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        setSearchValue(searchValue);
    };

    useEffect(() => {
        if (!open) {
            setSearchValue('');
        }
    }, [open]);

    const filteredFontList = Object.values(FONT_LIST).filter(font =>
        font.label.toLowerCase().includes(searchValue.toLowerCase()),
    );

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={setOpen}
            title="폰트 선택"
            triggerContent={
                <div className="flex justify-center text-xs items-center relative gap-2.5 border-none shadow-none outline-none focus:outline-none cursor-pointer">
                    <div>{FONT_LIST[value].label}</div>
                    <ChevronDown className="w-5 h-5" strokeWidth={1} />
                </div>
            }
            contentClassName="w-full max-h-[80vh] min-h-[40vh] overflow-y-auto pb-0 border-none items-start flex flex-col"
        >
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                <input
                    className="text-sm bg-transparent w-full pl-12 pr-2.5 py-2.5  border-b border-[#E5E5E5] focus:outline-none focus:ring-0 rounded-none"
                    placeholder="폰트명으로 검색"
                    onChange={handleSearch}
                />
            </div>
            <ScrollArea className="h-[60vh] w-full ">
                <div className="flex flex-col pb-6 pt-2">
                    {filteredFontList.map(font => (
                        <div
                            key={font.value}
                            className="flex justify-between text-xs items-center relative border-b border-gray-100 pb-3 shadow-none outline-none focus:outline-none cursor-pointer
                            active:bg-primary-pink/20 pt-4 px-4
                            "
                            onClick={() => onValueChange(font.value)}
                        >
                            <div className="relative w-64 h-8 flex">
                                <Image
                                    src={font.thumbnail}
                                    alt={font.label}
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
                            {value === font.value && (
                                <CheckIcon className="w-5 h-5 text-secondary-newpink" />
                            )}
                        </div>
                    ))}
                </div>
                {filteredFontList.length > 10 && (
                    <div className="text-xs text-gray-500 text-center pb-8">마지막입니다</div>
                )}
            </ScrollArea>
        </ResponsiveDialog>
    );
}
