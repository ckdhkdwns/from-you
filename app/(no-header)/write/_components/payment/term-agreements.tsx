import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { PAYMENT_TERMS } from '@/constants';

import React, { useEffect, useState } from 'react';

interface TermAgreementsProps {
    allAgreed: boolean;
    setAllAgreed: (_agreed: boolean) => void;
}

export default function TermAgreements({ allAgreed, setAllAgreed }: TermAgreementsProps) {
    const [open, setOpen] = useState(false);
    const [agreements, setAgreements] = useState<Record<string, boolean>>({});

    // 개별 약관 동의 상태 변경 함수
    const handleTermAgreement = (key: string, agreed: boolean) => {
        setAgreements(prev => ({
            ...prev,
            [key]: agreed,
        }));
    };

    // 전체 동의 상태 변경 함수
    const handleAllAgreement = (agreed: boolean) => {
        const newAgreements: Record<string, boolean> = {};
        PAYMENT_TERMS.forEach(term => {
            newAgreements[term.key] = agreed;
        });
        setAgreements(newAgreements);
        setAllAgreed(agreed);
    };

    // 모든 약관이 동의되었는지 확인하고 allAgreed 상태 업데이트
    useEffect(() => {
        const isAllAgreed = PAYMENT_TERMS.every(term => agreements[term.key]);
        setAllAgreed(isAllAgreed);
    }, [agreements, setAllAgreed]);

    // 외부에서 allAgreed 상태가 변경되었을 때 내부 상태 동기화
    useEffect(() => {
        if (allAgreed !== PAYMENT_TERMS.every(term => agreements[term.key])) {
            handleAllAgreement(allAgreed);
        }
    }, [allAgreed]);

    return (
        <div className="flex items-center gap-2 w-full text-sm flex-col my-4">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 my-2 w-full">
                    <Checkbox
                        checked={allAgreed}
                        onCheckedChange={handleAllAgreement}
                        onClick={e => e.stopPropagation()}
                    />
                    <div
                        onClick={e => {
                            e.stopPropagation();
                            handleAllAgreement(true);
                        }}
                        className="cursor-pointer"
                    >
                        필수 약관 전체 동의
                    </div>
                </div>
                <div
                    className="flex gap-2 text-gray-500 hover:underline min-w-16 justify-end cursor-pointer"
                    onClick={() => setOpen(!open)}
                >
                    {open ? '닫기' : '전체 보기'}
                </div>
            </div>

            <Collapsible className="w-full" open={open} onOpenChange={setOpen}>
                <CollapsibleContent>
                    <div className="flex flex-col gap-2">
                        {PAYMENT_TERMS.map(term => (
                            <div key={term.key} className="flex items-center gap-2 font-normal">
                                <Checkbox
                                    checked={agreements[term.key] || false}
                                    onCheckedChange={checked =>
                                        handleTermAgreement(term.key, checked === true)
                                    }
                                />
                                <div
                                    className="cursor-pointer hover:underline"
                                    onClick={() => {
                                        if (term.onClick) {
                                            term.onClick();
                                        }
                                    }}
                                >
                                    {term.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
