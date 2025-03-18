import { Button } from '@/components/ui/button';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';
import { TemplatePublic } from '@/models/types/template';
import Link from 'next/link';
import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { CircleHelp } from 'lucide-react';

export default function TemplateInfoSection({ template }: { template: TemplatePublic }) {
    const discount =
        template.initialPrice > 0
            ? Math.round(
                  ((template.initialPrice - template.discountedPrice) / template.initialPrice) *
                      100,
              )
            : 0;

    // 템플릿 정보 데이터 배열로 구성
    const priceDetails = [
        {
            label: '기본 구성',
            value: `봉투 1장, 편지지 ${template.initialQuantity.paper}장${
                template.initialQuantity.photo ? `, 사진 ${template.initialQuantity.photo}장` : ''
            }`,
        },
        {
            label: '추가 편지지',
            value: `최대 ${(template.maxQuantity?.paper || 0) - template.initialQuantity.paper}장`,
        },
        {
            label: '추가 사진',
            value: `최대 30장 (장당 ${template.additionalUnitPrice?.photo.toLocaleString()}원)`,
        },
    ];

    const announcementDetails = [
        '우편요금은 별도입니다',
        '4시 이전 주문시 당일 우체국에 접수됩니다',
    ];

    const sizeDetails = [
        {
            label: '봉투 크기',
            value: '18cmX12cm (100g) 크라프트지, 자켓형 봉투',
        },
        {
            label: '편지지 크기',
            value: '14.6cmX21cm(120g) 모조지, 양면',
        },
        {
            label: '사진 크기',
            value: '4x6(inch)',
        },
        {
            label: '편지 라인수',
            value: '1장당 최대 18줄',
        },
    ];

    return (
        <div className="gap-2 flex flex-col h-full">
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

            <div className="space-y-3 py-4 pb-1">
                {priceDetails.map((detail, index) => (
                    <div key={index} className="flex">
                        <div className=" font-medium min-w-[100px] text-sm">{detail.label}</div>
                        <div className="text-gray-450 font-medium text-sm whitespace-pre-line">
                            {detail.value}
                        </div>
                    </div>
                ))}
            </div>
            <div className="space-y-3">
                {sizeDetails.map((detail, index) => (
                    <div key={index} className="flex">
                        <div className="font-medium min-w-[100px] text-sm">{detail.label}</div>
                        <div className="text-gray-450 font-medium text-sm whitespace-pre-line">
                            {detail.value}
                        </div>
                    </div>
                ))}
            </div>
            <div className="space-y-2 pb-4 mt-4">
                {announcementDetails.map((detail, index) => (
                    <div key={index} className="flex">
                        <li className="text-secondary-newpink font-medium text-sm"> {detail}</li>
                    </div>
                ))}
            </div>

            <Link
                href={`/write?tid=${removeTableKeyPrefix(template.PK)}`}
                className="sticky bottom-6 md:relative md:bottom-0"
            >
                <Button
                    variant="pink"
                    className="w-full h-12 bg-secondary-newpink text-base font-semibold "
                >
                    작성하기
                </Button>
            </Link>

       
        </div>
    );
}
