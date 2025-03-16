import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface SuspenseWrapperProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function SuspenseWrapper({
    children,
    fallback = <Skeleton className="h-24 w-full rounded-md" />,
}: SuspenseWrapperProps) {
    return <Suspense fallback={fallback}>{children}</Suspense>;
}
