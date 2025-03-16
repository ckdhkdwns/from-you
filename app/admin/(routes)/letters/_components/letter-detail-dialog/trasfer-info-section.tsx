import React from 'react';
import { LetterPublic } from '@/models/types/letter';

interface TransferInfoSectionProps {
    letter: LetterPublic;
}

export default function TransferInfoSection({ letter }: TransferInfoSectionProps) {
    if (letter.paymentMethod !== 'transfer' || !letter.transferInfo) {
        return null;
    }

    const { transferInfo } = letter;

    // 현금영수증 타입 한글 표시
    const getCashReceiptTypeText = (type: string): string => {
        switch (type) {
            case 'personal':
                return '개인소득공제';
            case 'business':
                return '사업자증빙';
            case 'none':
            default:
                return '발급안함';
        }
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold mb-3 flex items-center gap-2">계좌이체 정보</h3>

            <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">입금자명</span>
                    <span className="font-medium">{transferInfo.depositorName}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">현금영수증</span>
                    <span className="font-medium">
                        {getCashReceiptTypeText(transferInfo.cashReceiptType)}
                    </span>
                </div>

                {transferInfo.cashReceiptType !== 'none' && transferInfo.cashReceiptNumber && (
                    <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="text-gray-500 font-medium">
                            {transferInfo.cashReceiptType === 'personal'
                                ? '휴대폰번호'
                                : '사업자번호'}
                        </span>
                        <span className="font-medium">{transferInfo.cashReceiptNumber}</span>
                    </div>
                )}

                {letter.paymentCompletedAt && (
                    <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="text-gray-500 font-medium">입금확인일시</span>
                        <span className="font-medium">
                            {new Date(letter.paymentCompletedAt).toLocaleString('ko-KR')}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
