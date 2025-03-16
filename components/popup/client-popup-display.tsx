'use client';

import { PopupPublic } from '@/models/types/popup';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

interface ClientPopupDisplayProps {
    popups: PopupPublic[];
}

export function ClientPopupDisplay({ popups }: ClientPopupDisplayProps) {
    const [isOpen, setIsOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [api, setApi] = useState<any>(null);
    const [doNotShowAgain, setDoNotShowAgain] = useState(false);

    useEffect(() => {
        // 로컬 스토리지에서 마지막으로 팝업을 닫은 시간을 확인
        const lastClosedTime = localStorage.getItem('fromyou:admin:popup');

        // 마지막으로 닫은 시간이 있고, 24시간이 지나지 않았다면 팝업을 표시하지 않음
        if (lastClosedTime) {
            const lastClosed = new Date(lastClosedTime);
            const now = new Date();
            const hoursDiff = (now.getTime() - lastClosed.getTime()) / (1000 * 60 * 60);

            if (hoursDiff < 24) {
                return;
            }
        }

        // 팝업 데이터가 있으면 열기
        if (popups.length > 0) {
            setIsOpen(true);
        }
    }, [popups]);

    const handleClose = () => {
        setIsOpen(false);

        // 체크박스가 체크되어 있으면 24시간 동안 팝업을 다시 표시하지 않도록 로컬 스토리지에 저장
        if (doNotShowAgain) {
            localStorage.setItem('fromyou:admin:popup', new Date().toISOString());
        }
    };

    // 팝업이 닫혔으면 아무것도 표시하지 않음
    if (!isOpen) {
        return null;
    }

    const plugin = [
        Autoplay({
            delay: 5000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
        }),
    ];

    return (
        <div className="fixed bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 z-100 max-w-sm shadow-lg rounded-md overflow-hidden bg-white z-[999]">
            <div className="relative">
                <Carousel
                    setApi={setApi}
                    plugins={plugin}
                    className="w-[400px]"
                    opts={{
                        loop: true,
                    }}
                >
                    <CarouselContent>
                        {popups.map((popup, index) => (
                            <CarouselItem key={index}>
                                <div className="relative w-[400px] h-[400px]">
                                    <Image
                                        src={popup.image}
                                        alt="팝업"
                                        fill
                                        className="object-contain object-center"
                                        draggable={false}
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {popups.length > 1 && (
                        <>
                            <CarouselPrevious />
                            <CarouselNext />
                        </>
                    )}
                </Carousel>

                {popups.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
                        {popups.map((_, index) => (
                            <button
                                key={index}
                                className={`w-2 h-2 rounded-full ${
                                    api?.selectedScrollSnap() === index ? 'bg-white' : 'bg-white/50'
                                }`}
                                onClick={() => api?.scrollTo(index)}
                                aria-label={`${index + 1}번 팝업으로 이동`}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className="flex items-center gap-2 p-4 border-t border-gray-200 justify-between">
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="popup-checkbox"
                        checked={doNotShowAgain}
                        onCheckedChange={checked => setDoNotShowAgain(checked === true)}
                    />
                    <Label
                        htmlFor="popup-checkbox"
                        className="text-sm text-gray-500 font-normal cursor-pointer"
                    >
                        24시간 동안 팝업을 다시 표시하지 않습니다.
                    </Label>
                </div>
                <button
                    onClick={handleClose}
                    aria-label="팝업 닫기"
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
            </div>
        </div>
    );
}
