import React, { forwardRef } from 'react';
import { mmToPx } from '@/lib/mmToPx';
import { TemplateConfigPublic } from '@/models/types/template-config';
import { Font } from '@/models/types/letter';
import Image from 'next/image';

interface LetterPaperProps {
    font: Font;
    text: string;
    config: TemplateConfigPublic | null;
    showSize?: boolean;
    onTextChange?: (_value: string) => void;
    onCompositionStart?: () => void;
    onCompositionEnd?: (_e: React.CompositionEvent<HTMLTextAreaElement>) => void;
    onPaste?: (_e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
    onKeyDown?: (_e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onKeyUp?: (_e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onFocus?: (_e: React.FocusEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    paperImage?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

const LetterPaper = forwardRef<HTMLTextAreaElement, LetterPaperProps>(
    (
        {
            font,

            config,
            showSize = false,
            onTextChange,
            onCompositionStart,
            onCompositionEnd,
            onPaste,
            onKeyDown,
            onKeyUp,
            onFocus,
            placeholder,
            paperImage,
            ...props
        },
        ref,
    ) => {
        const standardWidth = 120; // 기준 너비 (mm)

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (onTextChange) {
                onTextChange(e.target.value);
            }
        };
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
                    // backgroundSize: "cover",
                    // backgroundPosition: "center",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0 auto',
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

                <Image
                    src={'/blank-letter.png'}
                    alt="letter-paper"
                    width={mmToPx(standardWidth)}
                    height={mmToPx(standardWidth)}
                    className="w-full h-full object-cover absolute top-0 left-0 z-10"
                    draggable={false}
                />

                {/* 편지지 내용 영역 */}
                <textarea
                    ref={ref}
                    className="w-full h-full p-0 resize-none outline-none bg-transparent z-10 relative"
                    style={{
                        fontSize: `${mmToPx(config.fontSize[font.size])}px`,
                        lineHeight: `${mmToPx(config.lineHeight)}px`,
                        color: font.color,
                        fontFamily: font.family,
                        textAlign: font.align,
                        overflow: 'hidden',
                    }}
                    // value={text}
                    onChange={handleChange}
                    onCompositionStart={onCompositionStart}
                    onCompositionEnd={onCompositionEnd}
                    onPaste={onPaste}
                    onKeyDown={onKeyDown}
                    onKeyUp={onKeyUp}
                    onFocus={onFocus}
                    placeholder={placeholder || '편지 내용을 입력하세요...'}
                    {...props}
                />
            </div>
        );
    },
);

LetterPaper.displayName = 'LetterPaper';

export default LetterPaper;
