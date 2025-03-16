'use client';

import { cn } from '@/lib/utils';
import React from 'react';

const Star = ({ fill, onClick, size }: { fill?: string; onClick: () => void; size?: number }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={onClick}
            className={cn(onClick && 'cursor-pointer', 'hover:opacity-80')}
        >
            <path
                d="M7.52447 0.463526C7.67415 0.0028708 8.32585 0.00286996 8.47553 0.463525L9.90837 4.87336C9.97531 5.07937 10.1673 5.21885 10.3839 5.21885H15.0207C15.505 5.21885 15.7064 5.83865 15.3146 6.12336L11.5633 8.84878C11.3881 8.9761 11.3148 9.20179 11.3817 9.4078L12.8145 13.8176C12.9642 14.2783 12.437 14.6613 12.0451 14.3766L8.29389 11.6512C8.11865 11.5239 7.88135 11.5239 7.70611 11.6512L3.95488 14.3766C3.56303 14.6613 3.03578 14.2783 3.18546 13.8176L4.6183 9.4078C4.68524 9.20179 4.61191 8.9761 4.43667 8.84878L0.685441 6.12336C0.293584 5.83866 0.494972 5.21885 0.979333 5.21885H5.6161C5.83272 5.21885 6.02469 5.07937 6.09163 4.87336L7.52447 0.463526Z"
                fill={fill || '#d9d9d9'}
            />
        </svg>
    );
};

export default function RatingStar({
    rating,
    onClick,
    size = 18,
}: {
    rating: number;
    onClick?: (_rating: number) => void;
    size?: number;
}) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
                <Star
                    key={index}
                    fill={index < rating ? '#f57c7c' : '#d9d9d9'}
                    onClick={() => onClick(index + 1)}
                    size={size}
                />
            ))}
        </div>
    );
}
