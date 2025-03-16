import React from 'react';
import { cn } from '@/lib/utils';

export default function UnderlineInput({
    label,
    // eslint-disable-next-line react/prop-types
    className,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
    return (
        <div className={cn('flex flex-col md:flex-row md:items-center', className)}>
            <div className="text-sm text-gray-400 md:min-w-24 font-normal">{label}</div>

            <input
                {...props}
                className="border-b rounded-none border-gray-200 w-full bg-transparent p-1 ring-0 focus:outline-none focus:ring-0 focus:border-gray-400 text-sm"
            />
        </div>
    );
}
