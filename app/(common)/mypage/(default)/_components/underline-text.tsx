import React from 'react';
import { cn } from '@/lib/utils';

export default function UnderlineText({
    children,
    hidden = false,
    length = '110%',
    className,
}: {
    children: React.ReactNode;
    hidden?: boolean;
    length?: string;
    className?: string;
}) {
    return (
        <div className="relative">
            {!hidden && (
                <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 h-2 bg-primary-pink"
                    style={{ width: length }}
                ></span>
            )}
            <span className={cn('relative z-10', className)}>{children}</span>
        </div>
    );
}
