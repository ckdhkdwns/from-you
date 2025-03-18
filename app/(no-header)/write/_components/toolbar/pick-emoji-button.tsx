'use client';

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { EMOJI_CATEGORIES } from '@/constants';
import { useLetter } from '../../_contexts/letter-provider';
import EmojiIcon from './icons/emoji.svg';
import Image from 'next/image';

export default function PickEmojiButton() {
    const { text: pages, setText: setPages } = useLetter();

    // 현재 활성화된 텍스트 영역을 가리키는 전역 변수
    const activeTextareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    // 전역 이벤트 리스너를 통해 활성화된 텍스트 영역 추적
    React.useEffect(() => {
        const handleFocus = (e: FocusEvent) => {
            if (e.target instanceof HTMLTextAreaElement) {
                activeTextareaRef.current = e.target;
            }
        };

        // 문서 내 모든 텍스트 영역에 대한 포커스 이벤트 리스닝
        document.addEventListener('focusin', handleFocus);

        return () => {
            document.removeEventListener('focusin', handleFocus);
        };
    }, []);

    const handleEmojiSelect = (emoji: string) => {
        // 활성화된 텍스트 영역이 없는 경우 첫 번째 텍스트 영역을 선택
        let textarea = activeTextareaRef.current;
        if (!textarea) {
            const textareas = Array.from(document.querySelectorAll('textarea'));
            if (textareas.length > 0) {
                textarea = textareas[0] as HTMLTextAreaElement;
            } else {
                return; // 텍스트 영역이 없으면 중단
            }
        }

        // 현재 페이지 인덱스 찾기
        const pageIndex = Array.from(document.querySelectorAll('textarea')).findIndex(
            el => el === textarea,
        );

        if (pageIndex === -1) return;

        // 현재 텍스트 가져오기
        const currentText = pages[pageIndex] || '';

        // 커서 위치 확인 (유효하지 않으면 텍스트 끝)
        const start = typeof textarea.selectionStart === 'number' ? textarea.selectionStart : currentText.length;
        const end = typeof textarea.selectionEnd === 'number' ? textarea.selectionEnd : currentText.length;

        // 커서 위치에 이모지 삽입
        const newText = currentText.substring(0, start) + emoji + currentText.substring(end);

        // 페이지 내용 업데이트
        const newPages = [...pages];
        newPages[pageIndex] = newText;
        setPages(newPages);

        // 다음 타이머 틱에 커서 위치 이동 (이모지 뒤로)
        setTimeout(() => {
            textarea.focus();
            const newPosition = start + emoji.length;
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="cursor-pointer">
                    <EmojiIcon className="w-6 h-6 relative" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-3 bg-primary-ivory">
                <Tabs defaultValue="자주 사용" className="w-full">
                    <ScrollArea className="w-full">
                        <TabsList className="w-full inline-flex h-auto flex-wrap justify-start bg-transparent">
                            {Object.keys(EMOJI_CATEGORIES).map(category => (
                                <TabsTrigger key={category} value={category} className="text-sm">
                                    {category}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </ScrollArea>
                    <Separator className="my-2" />
                    {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                        <TabsContent key={category} value={category} className="mt-2">
                            <ScrollArea className="h-[200px]">
                                <div className="grid grid-cols-8 gap-1">
                                    {emojis.map((emoji, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleEmojiSelect(emoji)}
                                            className="p-1 hover:bg-gray-100 rounded text-xl"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    ))}
                </Tabs>
            </PopoverContent>
        </Popover>
    );
}
