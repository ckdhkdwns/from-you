'use client';

import ImageWithFallback from '@/components/image-with-fallback';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TemplatePublic } from '@/models/types/template';
import React from 'react';
import { useRouter } from 'next/navigation';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';

export default function TemplateCard({ template }: { template: TemplatePublic }) {
    const router = useRouter();
    const discount =
        template.initialPrice > 0
            ? Math.round(
                  ((template.initialPrice - template.discountedPrice) / template.initialPrice) *
                      100,
              )
            : 0;
    return (
        <Card
            className="overflow-hidden cursor-pointer border-none rounded-sm bg-transparent "
            onClick={() => router.push(`/templates/${removeTableKeyPrefix(template.PK)}`)}
        >
            <CardHeader className="relative aspect-square rounded-sm overflow-hidden">
                <ImageWithFallback
                    src={template.thumbnail}
                    alt={template.name}
                    className="object-cover"
                    fill
                />
            </CardHeader>
            <CardContent className="space-y-1 pt-3 px-2">
                <div className="flex flex-col ">
                    <div className="text-xs font-normal text-gray-500">#{template.category}</div>
                    <div className="text-sm font-semibold">{template.name}</div>
                </div>
                <div className="flex justify-between items-center gap-2">
                    {discount > 0 ? (
                        <div>
                            <p className="line-through text-gray-400 font-normal text-xs">
                                {template.initialPrice.toLocaleString()}원
                            </p>
                            <div className="flex justify-between items-end gap-1">
                                <div className="flex justify-start items-end">
                                    <p className="font-semibold text-left text-secondary-newpink">
                                        {discount}
                                    </p>
                                    <p className="text-base text-left text-secondary-newpink">%</p>
                                </div>
                                <div className="flex justify-start items-end">
                                    <div className="font-semibold">
                                        {template.discountedPrice.toLocaleString()}
                                    </div>
                                    <div className="text-sm font-medium mb-0.5">원</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="font-semibold">{template.initialPrice.toLocaleString()}원</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
