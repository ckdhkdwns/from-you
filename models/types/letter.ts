import { AddressPublic } from './address';
import { TemplateEntity } from './template';
import { DynamoEntity, EntityKeyPattern } from './dynamo';

/**
 * 편지 엔티티 키 생성 패턴
 */
export const LetterKeys: EntityKeyPattern = {
    pk: (letterId: string) => `USER#${letterId}`,
    sk: (letterId: string) => `LETTER#${letterId}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gsi1pk: (_: any = null) => 'LETTER',
    gsi1sk: (timestamp: string) => timestamp,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gsi2pk: (_: any = null) => 'LETTER',
    gsi2sk: (timestamp: string) => `COMPLETE#${timestamp}`,
};

export type Font = {
    size: 'small' | 'medium' | 'large';
    color: string;
    family: string;
    align: 'left' | 'center' | 'right';
};

export type Photo = {
    id: string;
    url: string;
    isUploaded: boolean;
    file?: File;
};

export type PaymentMethod = string;
export type PaymentStatus = 'pending' | 'complete' | 'failed';
export type ShippingStatus = 'pending' | 'shipping' | 'complete' | 'failed';

export type TransferInfo = {
    depositorName: string;
    cashReceiptType: 'none' | 'personal' | 'business';
    cashReceiptNumber: string;
};

export type PriceInfo = {
    paperPrice: number;
    photoPrice: number;
    postTypePrice: number;
    initialPrice: number;

    totalPrice: number;
};

export type PointInfo = {
    isUsingPoint: boolean;
    usePointAmount: number;
    earnPointAmount: number;
};

/**
 * 클라이언트에서 편지 생성/수정 시 사용하는 입력 타입
 */
export interface LetterInput {
    template: Partial<TemplateEntity>;
    text: string[];
    font: Font;
    photos: Photo[];
    recipientAddress: AddressPublic;
    senderAddress: AddressPublic;
    postType: string;

    // 선택적 필드
    isDraft?: boolean;
    price?: number;
    priceInfo?: PriceInfo;
    pointInfo?: PointInfo;
    transferInfo?: TransferInfo;

    // 기존 편지 수정 시 사용될 ID (새 편지는 불필요)
    id?: string;
}

export interface LetterEntity extends DynamoEntity {
    template: Partial<TemplateEntity>;
    text: string[];
    font: Font;

    photos: Photo[];

    recipientAddress: AddressPublic;
    senderAddress: AddressPublic;
    postType: string;
    isDraft?: boolean;
    createdAt?: string;
    updatedAt?: string;

    paymentRequestedAt?: string;
    paymentCompletedAt?: string;
    transferRequestedAt?: string;
    shippingCompletedAt?: string;

    priceInfo?: PriceInfo;
    pointInfo?: PointInfo;

    transferInfo?: TransferInfo;

    orderId?: string;
    paymentStatus?: PaymentStatus;
    shippingStatus?: ShippingStatus;
    paymentMethod?: PaymentMethod;

    trackingNumber?: string;
    isReviewed?: boolean;

    EntityType: 'LETTER';
}

export type LetterPublic = Omit<
    LetterEntity,
    'EntityType' | 'GSI1PK' | 'GSI1SK' | 'GSI2PK' | 'GSI2SK'
>;

export const toLetterPublic = (letter: LetterEntity): LetterPublic => {
    const {
        EntityType: _EntityType,
        GSI1PK: _GSI1PK,
        GSI1SK: _GSI1SK,
        GSI2PK: _GSI2PK,
        GSI2SK: _GSI2SK,
        ...publicLetter
    } = letter;
    return publicLetter;
};

/**
 * LetterInput에서 LetterEntity 생성을 위한 유틸리티 함수
 */
export const createLetterEntityFromInput = (
    input: LetterInput,
    userId: string,
    letterId: string,
    now: string,
): Partial<LetterEntity> => {
    return {
        PK: `USER#${userId}`,
        SK: `LETTER#${letterId}`,
        template: input.template,
        text: input.text,
        font: input.font,
        photos: input.photos,
        recipientAddress: input.recipientAddress,
        senderAddress: input.senderAddress,
        postType: input.postType,
        isDraft: true,
        updatedAt: now,
        priceInfo: input.priceInfo || {
            paperPrice: 0,
            photoPrice: 0,
            postTypePrice: 0,
            initialPrice: 0,
            totalPrice: 0,
        },
        pointInfo: input.pointInfo || {
            isUsingPoint: false,
            usePointAmount: 0,
            earnPointAmount: 0,
        },
        transferInfo: input.transferInfo || {
            depositorName: '',
            cashReceiptType: 'none',
            cashReceiptNumber: '',
        },
        GSI1PK: 'LETTER',
        GSI1SK: now,
        EntityType: 'LETTER',
    };
};
