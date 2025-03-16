import { Button } from '@/components/ui/button';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';
import { TemplatePublic } from '@/models/types/template';
import Link from 'next/link';
import React from 'react';

export default function TemplateInfoSection({ template }: { template: TemplatePublic }) {
    const discount =
        template.initialPrice > 0
            ? Math.round(
                  ((template.initialPrice - template.discountedPrice) / template.initialPrice) *
                      100,
              )
            : 0;

    // 템플릿 정보 데이터 배열로 구성
    const templateDetails = [
        {
            label: '기본 구성',
            value: `편지지 ${template.initialQuantity.paper}장 ${
                template.initialQuantity.photo ? `& 사진 ${template.initialQuantity.photo}장` : ''
            }`,
        },
        {
            label: '추가 편지지',
            value: '100장',
        },
        {
            label: '사진 가격',
            value: '최대 100장',
        },
    ];

    return (
        <div className="gap-2 flex flex-col">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">#{template.category}</div>
                    {/* <span className="text-sm text-gray-500">#{params.id}</span> */}
                </div>
                <h1 className="text-2xl font-semibold">{template.name}</h1>
                <div className="text-sm text-gray-500">{template.description}</div>
            </div>

            {/* <div className="space-y-1">
            <p className="text-gray-500">기본수량</p>
            <p className="font-medium">종이 {template.initialQuantity.paper}장 & 포토지 {template.initialQuantity.photo}장</p>
          </div> */}
            {discount > 0 ? (
                <div>
                    <div className="line-through text-gray-400 pt-4 font-normal">
                        {template.initialPrice.toLocaleString()}원
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-end gap-1">
                            <span className="text-secondary-newpink font-semibold text-xl">
                                {discount}%
                            </span>
                            <span className="text-xl font-semibold">
                                {template.discountedPrice.toLocaleString()}원
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <span className="text-xl font-semibold">
                        {template.initialPrice.toLocaleString()}원
                    </span>
                </div>
            )}

            <div className="space-y-3 py-4 pb-6">
                {templateDetails.map((detail, index) => (
                    <div key={index} className="flex">
                        <div className="text-gray-400 font-normal min-w-[100px] text-sm">
                            {detail.label}
                        </div>
                        <div className="font-medium text-sm">{detail.value}</div>
                    </div>
                ))}
            </div>
            <Link
                href={`/write?tid=${removeTableKeyPrefix(template.PK)}`}
                className="sticky bottom-6 md:relative md:bottom-0"
            >
                <Button
                    variant="pink"
                    className="w-full h-12 bg-secondary-newpink text-base font-semibold"
                >
                    작성하기
                </Button>
            </Link>
        </div>
    );
}
