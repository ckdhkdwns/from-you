'use client';

import { SectionContainer } from './section-container';
import { InfoItem } from './info-item';
import { LetterPublic } from '@/models/types/letter';
import { TemplateConfigPublic } from '../../../../../../models/types/template-config';
import { useState, useEffect, useRef, forwardRef } from 'react';

import ReadonlyPaper from '@/components/papers/readonly-paper';
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { useReactToPrint } from 'react-to-print';
import { createPrintStyle } from '../../_libs/print-style';
import { Printer } from 'lucide-react';

import { Button } from '@/components/ui/button';
import PrintablePaper from '@/components/papers/printable-paper';
import { FONT_LIST } from '@/constants';

interface LetterContentSectionProps {
    letter: LetterPublic;
    templateConfig: TemplateConfigPublic | null;
}

const PrintArea = forwardRef<
    HTMLDivElement,
    { letter: LetterPublic; templateConfig: TemplateConfigPublic | null }
>(({ letter, templateConfig }, ref) => {
    return (
        <div ref={ref}>
            {letter.text.map((text, index) => (
                <div
                    key={index}
                    style={{
                        width: `${templateConfig?.paperSize.width}mm`,
                        height: `${templateConfig?.paperSize.height}mm`,
                    }}
                >
                    <PrintablePaper
                        paperImage={letter.template?.paperImage}
                        text={text}
                        font={letter.font}
                        config={templateConfig}
                        orderId={letter.orderId}
                        pageNumber={index + 1}
                    />
                </div>
            ))}
        </div>
    );
});
PrintArea.displayName = 'PrintArea';

const BlankPrintArea = forwardRef<
    HTMLDivElement,
    { letter: LetterPublic; templateConfig: TemplateConfigPublic | null }
>(({ letter, templateConfig }, ref) => {
    return (
        <div ref={ref}>
            {letter.text.map((text, index) => (
                <div
                    key={index}
                    style={{
                        width: `${templateConfig?.paperSize.width}mm`,
                        height: `${templateConfig?.paperSize.height}mm`,
                    }}
                >
                    <PrintablePaper
                        paperImage="/blank-letter.png"
                        text={text}
                        font={letter.font}
                        config={templateConfig}
                        orderId={letter.orderId}
                        pageNumber={index + 1}
                    />
                </div>
            ))}
        </div>
    );
});
BlankPrintArea.displayName = 'BlankPrintArea';

export function LetterContentSection({ letter, templateConfig }: LetterContentSectionProps) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
    const printRef = useRef<HTMLDivElement>(null);
    const blankPrintRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    const handlePrint = useReactToPrint({
        pageStyle: createPrintStyle(
            templateConfig?.paperSize.width / 10,
            templateConfig?.paperSize.height / 10,
        ),
    });

    const reactToPrintContent = () => {
        return printRef.current;
    };

    const blankPrintContent = () => {
        return blankPrintRef.current;
    };

    return (
        <SectionContainer title="편지 내용">
            <div className="flex items-center justify-between">
                <h3 className="text-md font-semibold">편지 내용</h3>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            handlePrint(blankPrintContent);
                        }}
                    >
                        <Printer className="mr-2 h-4 w-4" />빈 배경 출력하기
                    </Button>
                    <Button
                        onClick={() => {
                            handlePrint(reactToPrintContent);
                        }}
                        size="sm"
                    >
                        <Printer className="mr-2 h-4 w-4" />
                        편지 {letter.text.length}장 출력하기
                    </Button>
                </div>
            </div>

            <div className="flex flex-col items-center">
                <div className="w-full mb-4">
                    <InfoItem label="템플릿" value={letter.template?.name} />
                    <InfoItem label="폰트" value={`${FONT_LIST[letter.font?.family].label}`} />
                </div>

                <Carousel className="w-full h-full max-w-full mx-auto" setApi={setApi}>
                    <CarouselContent>
                        {letter.text.map((text, index) => (
                            <CarouselItem key={index}>
                                <div className="flex justify-center">
                                    <ReadonlyPaper
                                        paperImage={letter.template?.paperImage}
                                        text={text}
                                        font={letter.font}
                                        config={templateConfig}
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                </Carousel>

                <div className="flex items-center justify-center w-full mt-4">
                    <div className="text-sm text-gray-500">
                        {current} / {count}
                    </div>
                </div>
            </div>

            <div className="hidden">
                <PrintArea ref={printRef} letter={letter} templateConfig={templateConfig} />
                <BlankPrintArea
                    ref={blankPrintRef}
                    letter={letter}
                    templateConfig={templateConfig}
                />
            </div>
        </SectionContainer>
    );
}
