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

type StatusOption<T> = {
    value: T;
    label: string;
};

const paymentStatusOptions: StatusOption<PaymentStatus>[] = [
    { value: 'pending', label: '결제 대기중' },
    { value: 'complete', label: '결제 완료' },
    { value: 'failed', label: '결제 실패' },
];

const shippingStatusOptions: StatusOption<ShippingStatus>[] = [
    { value: 'pending', label: '배송 대기중' },
    { value: 'shipping', label: '배송 중' },
    { value: 'complete', label: '배송 완료' },
    { value: 'failed', label: '배송 실패' },
];

interface StatusButtonProps<T> {
    selectedRows: LetterPublic[];
    onUpdateStatus: (_rows: LetterPublic[], _status: T) => Promise<void>;
    options: StatusOption<T>[];
    buttonLabel: string;
}

function StatusButton<T extends string>({
    selectedRows,
    onUpdateStatus,
    options,
    buttonLabel,
}: StatusButtonProps<T>) {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1" size="sm">
                    {buttonLabel} <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {options.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => onUpdateStatus(selectedRows, option.value)}
                        className="cursor-pointer !text-xs"
                    >
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

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
                size="sm"
            >
                삭제
            </Button>
            <Button
                variant="outline"
                onClick={() => handleExportSelectedLetters(selectedRows)}
                disabled={selectedRows.length === 0}
                size="sm"
            >
                내보내기
            </Button>
            <StatusButton
                selectedRows={selectedRows}
                onUpdateStatus={handleUpdatePaymentStatus}
                options={paymentStatusOptions}
                buttonLabel="결제상태 변경"
            />
            <StatusButton
                selectedRows={selectedRows}
                onUpdateStatus={handleUpdateShippingStatus}
                options={shippingStatusOptions}
                buttonLabel="배송상태 변경"
            />
        </div>
    );
}
