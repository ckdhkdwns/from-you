'use client';

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { COLORS } from '@/constants';

export default function PickColorButton({
    fontColor,
    onColorChange,
}: {
    fontColor: string;
    onColorChange: (_color: string) => void;
}) {
    const [open, setOpen] = useState(false);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="cursor-pointer">
                    <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                        preserveAspectRatio="none"
                    >
                        <rect x={4} y={4} width={16} height={1} fill="#333333" />
                        <rect
                            x={13}
                            y={5}
                            width={16}
                            height={1}
                            transform="rotate(90 13 5)"
                            fill="#333333"
                        />
                        <circle cx={18} cy={19} r={2} fill={fontColor} />
                    </svg>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-2 bg-primary-ivory">
                <div className="grid grid-cols-3 gap-2">
                    {COLORS.map(color => (
                        <button
                            key={color}
                            className={`w-12 h-12 rounded-lg border-2 ${
                                fontColor === color ? 'border-black' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                                onColorChange(color);
                                setOpen(false);
                            }}
                        />
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
