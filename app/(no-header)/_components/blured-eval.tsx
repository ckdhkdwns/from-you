'use client';

import Image from 'next/image';

export default function BluredEval() {
    return (
        <Image
            src="/blured-eval.svg"
            alt="Blured evaluation background"
            width={1440}
            height={836}
            className="w-full h-full"
            priority
        />
    );
}
