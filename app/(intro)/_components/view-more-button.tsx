import Link from 'next/link';
import React from 'react';
import { ChevronRight } from 'react-feather';

export default function ViewMoreButton({ href }: { href: string }) {
    return (
        <Link href={href} className="flex items-center text-gray-500 gap-1 text-sm">
            <div>더보기</div>
            <ChevronRight strokeWidth={1.5} className="w-5 h-5" />
        </Link>
    );
}
