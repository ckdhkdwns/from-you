import React from 'react';
import AlignLeftIcon from './icons/align-left.svg';
import AlignCenterIcon from './icons/align-center.svg';
import AlignRightIcon from './icons/align-right.svg';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, CheckIcon } from 'lucide-react';

type AlignType = 'left' | 'center' | 'right';

const alignOptions: { value: AlignType; icon: React.ReactNode; label: string }[] = [
    { value: 'left', icon: <AlignLeftIcon />, label: '왼쪽' },
    { value: 'center', icon: <AlignCenterIcon />, label: '가운데' },
    { value: 'right', icon: <AlignRightIcon />, label: '오른쪽' },
];

export default function FontAlignSelect({
    fontAlign,
    onFontAlignChange,
}: {
    fontAlign: AlignType;
    onFontAlignChange: (_align: AlignType) => void;
}) {
    // 현재 선택된 정렬 옵션 찾기
    const currentAlign = alignOptions.find(option => option.value === fontAlign);

    return (
        <>
            {/* 모바일 버전: 드롭다운 셀렉트 */}
            <div className="md:hidden flex">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="text-xs bg-transparent border-none shadow-none outline-none focus:outline-none cursor-pointer w-16 gap-2">
                        <div className="flex items-center justify-end gap-2 font-normal">
                            <div>{currentAlign?.icon}</div>
                            <ChevronDown className="w-5 h-5" strokeWidth={1} />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-primary-ivory py-4">
                        {alignOptions.map(option => (
                            <DropdownMenuItem
                                key={option.value}
                                onClick={() => onFontAlignChange(option.value)}
                                className="text-xs !hover:bg-primary-ivory cursor-pointer focus:bg-primary-ivory justify-between border-b border-gray-100 last:border-b-0 py-2.5"
                            >
                                <div
                                    className={cn(
                                        'text-primary-black flex items-center gap-2',
                                        fontAlign === option.value && 'text-secondary-newpink',
                                    )}
                                >
                                    <span className="mt-1">{option.icon}</span>
                                    <span>{option.label}</span>
                                </div>
                                {fontAlign === option.value && (
                                    <CheckIcon className="w-5 h-5 text-secondary-newpink" />
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* 데스크톱 버전: 기존 아이콘 형식 */}
            <div className="hidden md:flex justify-start items-center gap-2">
                {alignOptions.map(({ value, icon }) => (
                    <div
                        key={value}
                        onClick={() => onFontAlignChange(value)}
                        className={cn(
                            'p-1 rounded-sm cursor-pointer ',
                            fontAlign === value ? 'bg-primary-pink' : 'bg-primary-ivory',
                        )}
                    >
                        {icon}
                    </div>
                ))}
            </div>
        </>
    );
}
