'use client';

import { useState } from 'react';

import { TemplatePublic } from '@/models/types/template';
import { TemplateConfigPublic } from '@/models/types/template-config';
import { AddressPublic } from '@/models/types/address';
import { Font, LetterPublic, Photo } from '@/models/types/letter';
import { removeTableKeyPrefix } from '@/lib/api-utils';
import { SendTimeConfigPublic } from '@/models/types/send-time-config';
import { useUserData } from '@/contexts/session';

export const defaultAddress: Partial<AddressPublic> = {
    zonecode: '',
    name: '',
    address1: '',
    address2: '',
    contact: '',
    phone: '',
};

export const defaultFont: Font = {
    size: 'medium',
    color: '#000',
    family: 'Pretendard-Regular',
    align: 'left',
};

export const useLetterState = (
    initialLetter: LetterPublic | null,
    initialTemplate: TemplatePublic,
    initialTemplateConfig: TemplateConfigPublic,
    initialSendTimeConfig: SendTimeConfigPublic,
) => {
    const { addresses } = useUserData();

    // 기본 상태들
    const [isLoading, setIsLoading] = useState(false);
    const [isAutoSaving, setIsAutoSaving] = useState(false);
    const [letterId, setLetterId] = useState<string | null>(
        removeTableKeyPrefix(initialLetter?.SK || '') || null,
    );
    const [isEditing, setIsEditing] = useState(!!initialLetter);

    // 템플릿 관련 상태
    const [template, setTemplate] = useState<TemplatePublic>(initialTemplate);
    const [templateConfig, _a] = useState<TemplateConfigPublic>(initialTemplateConfig);

    // 발송 시간 관련 상태
    const [sendTimeConfig, _b] = useState<SendTimeConfigPublic>(initialSendTimeConfig);

    // 편지 콘텐츠 관련 상태
    const [font, setFont] = useState<Font>(initialLetter?.font || defaultFont);
    const [text, setText] = useState<string[]>(initialLetter?.text || []);
    const [photo, setPhoto] = useState<Photo[]>(initialLetter?.photos || []);

    // 주소 관련 상태
    const [recipientAddress, setRecipientAddress] = useState<Partial<AddressPublic>>(
        initialLetter?.recipientAddress ||
            addresses.recipient.find(address => address.isDefault) ||
            defaultAddress,
    );
    const [senderAddress, setSenderAddress] = useState<Partial<AddressPublic>>(
        initialLetter?.senderAddress ||
            addresses.sender.find(address => address.isDefault) ||
            defaultAddress,
    );
    const [postTypes, setPostTypes] = useState<string>(initialLetter?.postType || '');
    const [saveRecipientAddress, setSaveRecipientAddress] = useState(false);
    const [saveSenderAddress, setSaveSenderAddress] = useState(false);

    // 결제 관련 상태
    const [paymentMethod, setPaymentMethod] = useState(initialLetter?.paymentMethod || 'toss');
    const [tossPaymentMethod, setTossPaymentMethod] = useState<string | null>(null);
    const [isUsingPoint, setIsUsingPoint] = useState(
        initialLetter?.pointInfo?.isUsingPoint || false,
    );

    return {
        // 기본 상태 반환
        isLoading,
        setIsLoading,
        isAutoSaving,
        setIsAutoSaving,
        letterId,
        setLetterId,
        isEditing,
        setIsEditing,

        // 템플릿 상태 반환
        template,
        setTemplate,
        templateConfig,

        // 발송 시간 상태 반환
        sendTimeConfig,

        // 편지 콘텐츠 상태 반환
        font,
        setFont,
        text,
        setText,
        photo,
        setPhoto,

        // 주소 상태 반환
        recipientAddress,
        setRecipientAddress,
        senderAddress,
        setSenderAddress,
        postTypes,
        setPostTypes,
        saveRecipientAddress,
        setSaveRecipientAddress,
        saveSenderAddress,
        setSaveSenderAddress,

        // 결제 상태 반환
        paymentMethod,
        setPaymentMethod,
        tossPaymentMethod,
        setTossPaymentMethod,
        isUsingPoint,
        setIsUsingPoint,
    };
};
