'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'react-feather';

interface AddressButtonProps {
    label: string;
    onClick: () => void;
    className?: string;
}

export default function AddressButton({ label, onClick, className = '' }: AddressButtonProps) {
    return (
        <Button
            variant="ghost"
            className={`flex items-center gap-1 text-gray-450 hover:text-primary-black font-normal pr-1 pl-0 !px-0 !h-8 !py-0 text-xs duration-0 drag-none ${className}`}
            onClick={onClick}
        >
            {label}
            <ChevronRight className="w-4 h-4" strokeWidth={1} />
        </Button>
    );
}
