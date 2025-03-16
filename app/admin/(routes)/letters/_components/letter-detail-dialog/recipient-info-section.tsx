'use client';

import { SectionContainer } from './section-container';
import { InfoItem } from './info-item';
import { LetterPublic } from '@/models/types/letter';

interface RecipientInfoSectionProps {
    letter: LetterPublic;
}

export function RecipientInfoSection({ letter }: RecipientInfoSectionProps) {
    return (
        <SectionContainer title="수신자 정보">
            <InfoItem label="이름" value={letter.recipientAddress?.name} />
            <InfoItem label="우편번호" value={letter.recipientAddress?.zonecode} />
            <InfoItem
                label="주소"
                value={`${letter.recipientAddress?.address1} ${letter.recipientAddress?.address2}`}
            />
            {letter.recipientAddress?.contact && (
                <InfoItem label="연락처" value={letter.recipientAddress.contact} />
            )}
            {letter.recipientAddress?.phone && (
                <InfoItem label="전화번호" value={letter.recipientAddress.phone} />
            )}
        </SectionContainer>
    );
}
