import React from 'react';
import { mmToPx } from '@/lib/mmToPx';
import { TemplateConfigPublic } from '@/models/types/template-config';
import { Font } from '@/models/types/letter';

interface ReadonlyPaperProps {
    font: Font;
    text: string;
    config: TemplateConfigPublic | null;
    showSize?: boolean;
    placeholder?: string;
    paperImage?: string;
    orderId?: string;
    pageNumber?: number;
}

const PrintablePaper = ({
    font,
    text,
    config,
    placeholder,
    paperImage,
    orderId,
    pageNumber,
    ...props
}: ReadonlyPaperProps) => {
    if (!config) {
        return null;
    }

    const standardWidth = 120;
    return (
        <div
            className="relative bg-white"
            style={{
                transform: `scale(${config.paperSize.width / standardWidth})`,
                transformOrigin: 'top center',
                maxWidth: mmToPx(standardWidth),
                width: mmToPx(standardWidth),
                minWidth: mmToPx(standardWidth),
                aspectRatio: `${config.paperSize.width}/${config.paperSize.height}`,
                padding: `${config.padding.top}px ${config.padding.right}px ${config.padding.bottom}px ${config.padding.left}px`,
                backgroundImage: `url(${paperImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto',
            }}
        >
            {/* 편지지 내용 영역 */}
            <textarea
                className="w-full h-full p-0 resize-none outline-none bg-transparent"
                style={{
                    fontSize: `${mmToPx(config.fontSize[font.size])}px`,
                    lineHeight: `${mmToPx(config.lineHeight)}px`,
                    fontFamily: font.family,
                    color: font.color,
                    overflow: 'hidden',
                }}
                readOnly
                value={text}
                placeholder={placeholder || '편지 내용을 입력하세요...'}
                {...props}
            />
            <div
                className="absolute flex justify-between bottom-4 px-4 left-1/2 -translate-x-1/2 w-full text-gray-400 font-normal"
                style={{
                    fontSize: 10,
                }}
            >
                <div>{orderId}</div>
                <div>{pageNumber}</div>
            </div>
        </div>
    );
};

export default PrintablePaper;
