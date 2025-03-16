import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronDown } from 'lucide-react';
import React from 'react';

export default function FontSizeSelect({
    onValueChange,
    value,
}: {
    onValueChange: (_value: string) => void;
    value: string;
}) {
    const items = ['small', 'medium', 'large'];

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="text-xs bg-transparent border-none shadow-none outline-none focus:outline-none cursor-pointer w-20 gap-2">
                <div className="flex items-center justify-end gap-2 font-normal">
                    <div>{value.charAt(0).toUpperCase() + value.slice(1)}</div>
                    <ChevronDown className="w-5 h-5" strokeWidth={1} />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-primary-ivory py-4">
                {items.map((item, index) => (
                    <DropdownMenuItem
                        key={item}
                        onClick={() => onValueChange(item)}
                        className="text-xs !hover:bg-primary-ivory cursor-pointer focus:bg-primary-ivory justify-between border-b border-gray-100 last:border-b-0 py-2.5"
                    >
                        <div
                            style={{
                                fontWeight: 'normal',
                                fontSize: `${0.8 + index * 0.15}rem`,
                            }}
                            className={cn(
                                'text-primary-black',
                                value === item && 'text-secondary-newpink',
                            )}
                        >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </div>
                        {value === item && <CheckIcon className="w-5 h-5 text-secondary-newpink" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
