'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LetterPublic, PaymentStatus, ShippingStatus } from '@/models/types/letter';
import { useLetterActions } from '../_hooks/use-letter-actions';

// 결제 상태 변경 버튼 컴포넌트
const PaymentStatusButton = ({
    selectedRows,
    onUpdateStatus,
}: {
    selectedRows: LetterPublic[];
    onUpdateStatus: (_rows: LetterPublic[], _status: PaymentStatus) => Promise<void>;
}) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
                결제상태 변경 <ChevronDown className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onUpdateStatus(selectedRows, 'pending')}>
                결제 대기중
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(selectedRows, 'complete')}>
                결제 완료
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(selectedRows, 'failed')}>
                결제 실패
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

// 배송 상태 변경 버튼 컴포넌트
const ShippingStatusButton = ({
    selectedRows,
    onUpdateStatus,
}: {
    selectedRows: LetterPublic[];
    onUpdateStatus: (_rows: LetterPublic[], _status: ShippingStatus) => Promise<void>;
}) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
                배송상태 변경 <ChevronDown className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onUpdateStatus(selectedRows, 'pending')}>
                배송 대기중
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(selectedRows, 'shipping')}>
                배송 중
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(selectedRows, 'complete')}>
                배송 완료
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(selectedRows, 'failed')}>
                배송 실패
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

export function LetterActionsToolbar({ selectedRows }: { selectedRows: LetterPublic[] }) {
    const {
        handleDeleteSelectedLetters,
        handleExportSelectedLetters,
        handleUpdatePaymentStatus,
        handleUpdateShippingStatus,
    } = useLetterActions();

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                onClick={() => handleDeleteSelectedLetters(selectedRows)}
                disabled={selectedRows.length === 0}
            >
                삭제
            </Button>
            <Button
                variant="outline"
                onClick={() => handleExportSelectedLetters(selectedRows)}
                disabled={selectedRows.length === 0}
            >
                내보내기
            </Button>
            <PaymentStatusButton
                selectedRows={selectedRows}
                onUpdateStatus={handleUpdatePaymentStatus}
            />
            <ShippingStatusButton
                selectedRows={selectedRows}
                onUpdateStatus={handleUpdateShippingStatus}
            />
        </div>
    );
}
