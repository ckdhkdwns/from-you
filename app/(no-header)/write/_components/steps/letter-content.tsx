'use client';

import LetterPaper from '@/components/papers/letter-paper';
import React, { useState, useRef, useEffect } from 'react';
import { useLetter } from '../../_contexts/letter-provider';
import Toolbar from '../toolbar/toolbar';
import useLetterScale from '../../_hooks/use-letter-scale';
import { X } from 'react-feather';
import ReadonlyPaper from '@/components/papers/readonly-paper';
import { useConfirm } from '@/contexts/confirm-provider';

export default function LetterContent() {
    const { font, text: pages, setText: setPages, templateConfig, template } = useLetter();
    const { confirm } = useConfirm();

    // 각 페이지의 내용을 관리하는 상태
    // const [pages, setPages] = useState<string[]>([""]);
    // 한글 조합 중인지 여부를 추적
    const [isComposing, setIsComposing] = useState<boolean>(false);
    // 마지막 키 이벤트 저장
    const lastKeyEventRef = useRef<KeyboardEvent | null>(null);
    // 현재 활성화된 텍스트 영역
    const [_activeTextarea, setActiveTextarea] = useState<HTMLTextAreaElement | null>(null);

    // 각 텍스트 영역에 대한 ref 배열
    const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

    const { letterScale, scaledGap } = useLetterScale({
        templateConfig,
    });

    // 초기 마운트 시에만 실행되는 초기화
    useEffect(() => {
        if (pages && pages.length > 0) {
            textareaRefs.current.forEach((textarea, index) => {
                if (textarea) {
                    textarea.value = pages[index];
                }
            });
        } else {
            setPages(['']);
        }
    }, [pages]); // text 의존성 제거

    // // 페이지 내용이 변경될 때만 전역 상태 업데이트
    // useEffect(() => {
    //     // pages가 비어있는 경우를 처리
    //     if (pages.length === 0) return;

    //     // 현재 페이지와 기존 text 배열이 다를 때만 업데이트
    //     const filteredPages = pages.filter((page) => page !== undefined);

    //     // 깊은 비교를 통해 실제 변경이 있는 경우만 업데이트
    //     const hasChanged =
    //         filteredPages.length !== text.length ||
    //         filteredPages.some((page, i) => page !== text[i]);

    //     if (hasChanged) {
    //         setText(filteredPages);
    //     }
    // }, [pages, setText, text]);

    // 텍스트 영역 ref 설정 함수
    const setTextareaRef = (element: HTMLTextAreaElement | null, index: number) => {
        textareaRefs.current[index] = element;
    };

    // 특정 페이지의 내용 업데이트
    const updatePageContent = (index: number, content: string) => {
        setPages(prev => {
            // 이미 동일한 내용인 경우 불필요한 업데이트 방지
            if (prev[index] === content) return prev;

            const newPages = [...prev];
            newPages[index] = content;
            return newPages;
        });
    };

    // 페이지 추가 핸들러
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const handleAddPage = () => {
        if (pages.length >= 10) {
            alert('편지는 10장까지 작성할 수 있습니다.');
            return;
        }

        // 새 페이지 추가
        setPages(prev => [...prev, '']);

        // 새로 추가된 페이지의 텍스트 영역에 포커스
        setTimeout(() => {
            const newIndex = pages.length;
            const textarea = textareaRefs.current[newIndex];
            if (textarea) {
                textarea.focus();
            }
        }, 10);
    };

    // 페이지 삭제 핸들러
    const handleDeletePage = async (index: number) => {
        if (index === 0 && pages.length === 1) return; // 유일한 페이지는 삭제 불가

        const isConfirmed = await confirm({
            title: '페이지 삭제',
            description: '해당 페이지를 삭제하시겠습니까? 페이지 내용이 삭제됩니다.',
            confirmText: '삭제',
            cancelText: '취소',
        });

        if (isConfirmed) {
            // 페이지 삭제
            setPages(prev => prev.filter((_, i) => i !== index));
        }
    };

    // 한글 조합 시작 핸들러
    const handleCompositionStart = () => {
        setIsComposing(true);
    };

    // 한글 조합 종료 핸들러
    const handleCompositionEnd = (
        e: React.CompositionEvent<HTMLTextAreaElement>,
        index: number,
    ) => {
        setIsComposing(false);
        handleTextInput(e, index, false);
    };

    // 텍스트 입력 처리
    const handleTextInput = (
        e:
            | React.FormEvent<HTMLTextAreaElement>
            | React.CompositionEvent<HTMLTextAreaElement>
            | React.KeyboardEvent<HTMLTextAreaElement>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            | any,
        index: number,
        isFocus: boolean = true,
    ) => {
        const textarea = e.currentTarget;
        const currentText = textarea.value;

        // 커서 위치 저장
        const savedCursorPosition = textarea.selectionStart;

        // 조합 중일 때는 오버플로우 처리하지 않음
        if (isComposing) return;

        const maxHeight = textarea.clientHeight;

        // 오버플로우 체크
        if (textarea.scrollHeight > maxHeight && !isComposing) {
            let removedChars = '';
            let newText = currentText;
            let maxRecursion = 10000; // 무한 루프 방지

            // 오버플로우가 해결될 때까지 문자를 한 글자씩 제거
            while (textarea.scrollHeight > maxHeight && maxRecursion > 0) {
                removedChars = newText.slice(-1) + removedChars;
                newText = newText.slice(0, -1);
                textarea.value = newText;
                maxRecursion--;
            }

            // 현재 페이지 내용 업데이트
            updatePageContent(index, newText);

            // 커서 위치 복원 (값 강제 변경 시 커서 위치가 초기화되는 버그 방지)
            if (!e?.nativeEvent?.detail?.recursion) {
                setTimeout(() => {
                    textarea.setSelectionRange(savedCursorPosition, savedCursorPosition);
                }, 0);
            }

            // 제거된 문자가 있거나 엔터키를 입력한 경우
            if (
                removedChars.trim() !== '' ||
                (lastKeyEventRef.current?.key === 'Enter' && removedChars.length === 1)
            ) {
                // 다음 페이지가 이미 있으면 내용 결합
                if (index + 1 < pages.length) {
                    const nextPage = pages[index + 1] || '';
                    updatePageContent(index + 1, removedChars + nextPage);

                    // 커서를 다음 페이지로 이동
                    const nextTextarea = textareaRefs.current[index + 1];
                    console.log(nextTextarea);
                    if (nextTextarea) {
                        nextTextarea.value = removedChars.trim() + nextTextarea.value;
                        const recursionEvent = new CustomEvent('input', {
                            bubbles: true,
                            detail: {
                                recursion: true,
                            },
                        });
                        nextTextarea.dispatchEvent(recursionEvent);
                    }

                    if (
                        nextTextarea &&
                        textarea.value.length < savedCursorPosition &&
                        !e?.nativeEvent?.detail?.recursion
                    ) {
                        nextTextarea.focus();
                        nextTextarea.setSelectionRange(0, 0);
                    }
                } else if (pages.length < 10) {
                    // 새 페이지 추가
                    setTimeout(() => {
                        setPages(prev => [...prev, removedChars]);
                    }, 0);

                    // 새 페이지로 포커스 이동
                    setTimeout(() => {
                        const nextTextarea = textareaRefs.current[index + 1];
                        if (nextTextarea && isFocus) {

                            
                            nextTextarea.focus();
                            nextTextarea.setSelectionRange(0, 0);
                            
                            nextTextarea.value = removedChars;
                        }
                    }, 0);
                }
            }
        }
    };

    // 텍스트 변경 핸들러
    const handleTextChange = (value: string, index: number) => {
        updatePageContent(index, value);

        if (isComposing) return;

        const textarea = textareaRefs.current[index];
        if (textarea) {
            // 수동으로 이벤트 객체 생성
            const event = {
                currentTarget: textarea,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                nativeEvent: {} as any,
            } as React.FormEvent<HTMLTextAreaElement>;

            handleTextInput(event, index);
        }
    };

    // 키 다운 이벤트 핸들러
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
        lastKeyEventRef.current = e.nativeEvent;

        handleTextInput(e, index, false);
    };

    // 키 업 이벤트 핸들러
    const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
        handleTextInput(e, index, false);
    };

    // 붙여넣기 이벤트 핸들러
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>, index: number) => {
        // 붙여넣기 직후 텍스트 처리
        setTimeout(() => {
            const textarea = textareaRefs.current[index];
            if (textarea) {
                // 수동으로 이벤트 객체 생성
                const event = {
                    currentTarget: textarea,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    nativeEvent: {} as any,
                } as React.FormEvent<HTMLTextAreaElement>;

                handleTextInput(event, index);
            }
        }, 0);
    };

    // 포커스 핸들러
    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setActiveTextarea(e.target);
    };

    // // 컴포넌트 마운트/언마운트 시 viewport 메타 태그 관리
    // useEffect(() => {
    //     // 기존 viewport 메타 태그 저장
    //     const originalViewport = document.querySelector('meta[name="viewport"]');
    //     const originalContent = originalViewport?.getAttribute('content') || 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';

    //     // 새로운 viewport 메타 태그 설정 (확대 허용)
    //     const metaTag = document.createElement('meta');
    //     metaTag.name = 'viewport';
    //     metaTag.content = 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes';

    //     // 기존 태그가 있으면 제거
    //     if (originalViewport) {
    //         originalViewport.remove();
    //     }

    //     // 새 태그 추가
    //     document.head.appendChild(metaTag);

    //     // 컴포넌트 언마운트 시 원래 상태로 복원
    //     return () => {
    //         metaTag.remove();
    //         const resetViewport = document.createElement('meta');
    //         resetViewport.name = 'viewport';
    //         resetViewport.content = originalContent;
    //         document.head.appendChild(resetViewport);
    //     };
    // }, []);

    return (
        <div className="max-w-screen h-full">
            <div className="sticky top-0 left-0 right-0 z-10 bg-primary-ivory">
                <Toolbar />
            </div>
            <div className="h-full">
                <div
                    className="w-fit max-w-[100vw] mx-auto p-4 md:p-8 flex flex-col pb-20 mb-20 gap-20"
                    style={
                        {
                            // gap: `${scaledGap}px`,
                        }
                    }
                >
                    {/* 모든 페이지를 순서대로 표시 */}
                    {pages.map((pageContent, index) => (
                        <div
                            key={index}
                            className="flex flex-col gap-2 items-center max-w-[100vw] "
                        >
                            {/* 페이지 헤더 */}
                            <div className="flex items-center justify-between w-full">
                                {index !== 0 ? (
                                    <X
                                        className="w-4 h-4 text-gray-500 hover:text-gray-600 cursor-pointer"
                                        onClick={() => handleDeletePage(index)}
                                    />
                                ) : (
                                    <div className="w-4 h-4"></div>
                                )}
                                <div className="flex items-center gap-2 justify-end">
                                    <div className="text-sm text-gray-500 font-normal ">
                                        {index + 1} / {pages.length}
                                    </div>

                                    {/* {index !== 0 && pages.length > 1 && (
                                        <div>
                                            <div className="w-px h-4 bg-gray-200"></div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDeletePage(index)
                                                }
                                                className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )} */}
                                </div>
                            </div>

                            {/* 편지지 */}
                            <div
                                style={{
                                    transform: `scale(${letterScale})`,
                                    transformOrigin: 'top',
                                    // marginTop: -(1 - letterScale) * 120,
                                    marginBottom: -(1 - letterScale) * 600,
                                }}
                            >
                                <LetterPaper
                                    ref={el => setTextareaRef(el, index)}
                                    font={font}
                                    text={pageContent || ''}
                                    config={templateConfig}
                                    onTextChange={value => handleTextChange(value, index)}
                                    onCompositionStart={handleCompositionStart}
                                    onCompositionEnd={e => handleCompositionEnd(e, index)}
                                    onKeyDown={e => handleKeyDown(e, index)}
                                    onKeyUp={e => handleKeyUp(e, index)}
                                    onPaste={e => handlePaste(e, index)}
                                    onFocus={handleFocus}
                                    paperImage={template?.paperImage}
                                />
                            </div>
                        </div>
                    ))}

                    {/* 페이지 추가 버튼 */}
                    {/* {pages.length < 10 && (
                        <div className="flex justify-center mt-2">
                            <Button
                                variant="outline"
                                onClick={handleAddPage}
                                className="font-medium max-w-[300px] w-full"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                편지지 추가하기
                            </Button>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
}
