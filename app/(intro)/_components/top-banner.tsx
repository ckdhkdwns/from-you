import React from 'react';
import Image from 'next/image';

export default function TopBanner() {
    return (
        <div className="w-full relative flex aspect-[80/35] md:aspect-[120/35] max-h-[500px] bg-primary-pink rounded-md md:rounded-t-none overflow-hidden max-w-[1440px] mx-auto">
            <Image src="/banner.png" alt="fromyou-banner" fill className="object-cover object-center" />
        </div>
    );
}
