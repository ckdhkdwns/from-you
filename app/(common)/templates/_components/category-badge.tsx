import { Badge } from '@/components/ui/badge';
import React from 'react';

export default function CategoryBadge({ category }: { category: string }) {
    return (
        <Badge variant="outline" className="rounded-full font-normal text-gray-400 border-gray-100">
            #{category}
        </Badge>
    );
}
