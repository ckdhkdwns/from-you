import React from 'react';
import { mmToPx } from '@/lib/mmToPx';
import { TemplateConfigPublic } from '@/models/types/template-config';
import { Font } from '@/models/types/letter';
import Image from 'next/image';

interface ReadonlyPaperProps {
    font: Font;
    text: string;
    config: TemplateConfigPublic | null;
    showSize?: boolean;
    placeholder?: string;
    paperImage?: string;
}

const ReadonlyPaper = ({
    font,
    text,
    config,

    placeholder,
    paperImage,
    ...props
}: ReadonlyPaperProps) => {
    const standardWidth = 120; // 기준 너비 (mm)
    if (!config) {
        return null;
    }

    return (
        <div
            className="relative bg-white shadow-lg"
            style={{
                maxWidth: mmToPx(standardWidth),
                width: mmToPx(standardWidth),
                minWidth: mmToPx(standardWidth),
                aspectRatio: `${config.paperSize.width}/${config.paperSize.height}`,
                padding: `${config.padding.top}px ${config.padding.right}px ${config.padding.bottom}px ${config.padding.left}px`,
                // backgroundImage: `url(${paperImage})`,
                // backgroundSize: 'cover',
                // backgroundPosition: 'center',
                // display: 'flex',
                // // justifyContent: "center",
                // // alignItems: "center",
                // margin: '0 auto',
            }}
        >
            {paperImage && (
                <Image
                    src={paperImage}
                    alt="letter-paper"
                    width={mmToPx(standardWidth)}
                    height={mmToPx(standardWidth)}
                    className="w-full h-full object-cover absolute top-0 left-0 z-0"
                    draggable={false}
                />
            )}
            {/* 편지지 내용 영역 */}
            <textarea
                className="w-full h-full p-0 resize-none outline-none bg-transparent z-10 relative"
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

            {/* 치수 표시 */}
        </div>
    );
};

export default ReadonlyPaper;
