'use client';

import { parseDate } from '@/lib/date';
import { SectionContainer } from './section-container';
import { InfoItem } from './info-item';
import { LetterPublic, PaymentMethod, PaymentStatus, ShippingStatus } from '@/models/types/letter';
import PaymentMethodBadge from '@/components/ui/payment-method-badge';
import StatusBadge from '@/components/ui/status-badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { postTypeMapping } from '@/constants';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';

interface BasicInfoSectionProps {
    letter: LetterPublic;
    onUpdatePaymentStatus?: (_status: PaymentStatus) => Promise<boolean>;
    onUpdateShippingStatus?: (_status: ShippingStatus) => Promise<boolean>;
    onUpdateTrackingNumber?: (_trackingNumber: string) => Promise<void>;
}

export function BasicInfoSection({
    letter,
    onUpdatePaymentStatus,
    onUpdateShippingStatus,
    onUpdateTrackingNumber,
}: BasicInfoSectionProps) {
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(letter.paymentStatus);
    const [shippingStatus, setShippingStatus] = useState<ShippingStatus>(letter.shippingStatus);

    const [trackingNumber, setTrackingNumber] = useState<string>(letter.trackingNumber || '');

    const handlePaymentStatusChange = async (value: PaymentStatus) => {
        const result = await onUpdatePaymentStatus?.(value);
        if (result) {
            setPaymentStatus(value);
        }
    };

    const handleShippingStatusChange = async (value: ShippingStatus) => {
        const prevStatus = shippingStatus;
        setShippingStatus(value);
        const result = await onUpdateShippingStatus?.(value);
        if (!result) {
            setShippingStatus(prevStatus);
            return;
        }
    };

    const timestamps = [
        {
            label: '등록 일시',
            value: letter.createdAt,
        },
        {
            label: '결제 요청 일시',
            value: letter.transferRequestedAt || letter.paymentRequestedAt,
        },
        {
            label: '결제 완료 일시',
            value: letter.paymentCompletedAt,
        },
        {
            label: '배송 완료 일시',
            value: letter.shippingCompletedAt,
        },
    ];

    return (
        <SectionContainer title="기본 정보">
            <InfoItem label="사용자 ID" value={removeTableKeyPrefix(letter.PK)} />
            <InfoItem
                label="결제금액"
                value={`${letter.priceInfo.totalPrice.toLocaleString()}원`}
            />

            <InfoItem
                label="편지유형"
                value={postTypeMapping[letter.postType as keyof typeof postTypeMapping] || ''}
            />
            <InfoItem
                label="결제방식"
                value={<PaymentMethodBadge paymentMethod={letter.paymentMethod as PaymentMethod} />}
            />
            <InfoItem
                label="결제상태"
                value={
                    <Select value={paymentStatus} onValueChange={handlePaymentStatusChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue>
                                <StatusBadge status={paymentStatus} />
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">
                                <StatusBadge status="pending" />
                            </SelectItem>
                            <SelectItem value="complete">
                                <StatusBadge status="complete" />
                            </SelectItem>
                            <SelectItem value="failed">
                                <StatusBadge status="failed" />
                            </SelectItem>
                        </SelectContent>
                    </Select>
                }
            />
            <InfoItem
                label="배송상태"
                value={
                    <Select value={shippingStatus} onValueChange={handleShippingStatusChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue>
                                <StatusBadge status={shippingStatus} />
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">
                                <StatusBadge status="pending" />
                            </SelectItem>
                            <SelectItem value="shipping">
                                <StatusBadge status="shipping" />
                            </SelectItem>
                            <SelectItem value="complete">
                                <StatusBadge status="complete" />
                            </SelectItem>
                            <SelectItem value="failed">
                                <StatusBadge status="failed" />
                            </SelectItem>
                        </SelectContent>
                    </Select>
                }
            />
            {postTypeMapping[letter.postType as keyof typeof postTypeMapping] !== '일반우편' && (
                <InfoItem
                    label="등기번호"
                    value={
                        <div className="flex items-center gap-2">
                            <input
                                className="bg-transparent border-gray-300 border rounded-md p-2 px-4 text-sm h-9"
                                value={trackingNumber}
                                placeholder="등기번호를 입력해주세요."
                                onChange={e => setTrackingNumber(e.target.value)}
                            />
                            <Button
                                size="sm"
                                className="h-9"
                                onClick={() => onUpdateTrackingNumber?.(trackingNumber)}
                            >
                                등록
                            </Button>
                        </div>
                    }
                />
            )}
            <Separator className="my-4" />
            <div className="flex flex-col gap-2 pt-4">
                {timestamps.map(timestamp => {
                    if (timestamp.value) {
                        return (
                            <InfoItem
                                key={timestamp.label}
                                label={timestamp.label}
                                value={parseDate(timestamp.value)}
                            />
                        );
                    }
                })}
            </div>
        </SectionContainer>
    );
}
