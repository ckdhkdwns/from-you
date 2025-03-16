'use client';

import { SectionContainer } from './section-container';
import { InfoItem } from './info-item';
import { LetterPublic } from '@/models/types/letter';

interface SenderInfoSectionProps {
    letter: LetterPublic;
}

export function SenderInfoSection({ letter }: SenderInfoSectionProps) {
    return (
        <SectionContainer title="발신자 정보">
            <InfoItem label="이름" value={letter.senderAddress?.name} />
            <InfoItem label="우편번호" value={letter.senderAddress?.zonecode} />
            <InfoItem
                label="주소"
                value={`${letter.senderAddress?.address1} ${letter.senderAddress?.address2}`}
            />
            {letter.senderAddress?.contact && (
                <InfoItem label="연락처" value={letter.senderAddress.contact} />
            )}
            {letter.senderAddress?.phone && (
                <InfoItem label="전화번호" value={letter.senderAddress.phone} />
            )}
        </SectionContainer>
    );
}
