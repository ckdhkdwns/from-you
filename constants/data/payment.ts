/**
 * 결제 관련 상수 및 매핑 정보
 */

// 아이콘 타입 정의 (실제 컴포넌트에 맞게 수정 필요)
type IconName = string;

// 결제 방법 타입 정의
export interface PaymentMethodConfig {
    label: string;
    icon: IconName;
    className: string;
}

// 결제 방법 매핑
export const PAYMENT_METHOD = {
    CARD: 'CARD',
    TRANSFER: 'transfer',
    MOBILE: 'mobile',
    POINT: 'point',
    CASH: 'cash',
    TOSS: 'TOSSPAY',
    NAVERPAY: 'NAVERPAY',
    PAYCO: 'PAYCO',
    KAKAOPAY: 'KAKAOPAY',
    QUICK_TRANSFER: 'TRANSFER',
    MOBILE_PHONE: 'MOBILE_PHONE',
} as const;

// 결제 방법 타입
export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

// 결제 방법 라벨 매핑
export const paymentMethodMapping: Record<PaymentMethod, string> = {
    [PAYMENT_METHOD.CARD]: '카드',
    [PAYMENT_METHOD.TRANSFER]: '계좌이체',
    [PAYMENT_METHOD.MOBILE]: '휴대폰결제',
    [PAYMENT_METHOD.POINT]: '포인트결제',
    [PAYMENT_METHOD.CASH]: '현금결제',
    [PAYMENT_METHOD.TOSS]: '토스페이',
    [PAYMENT_METHOD.NAVERPAY]: '네이버페이',
    [PAYMENT_METHOD.PAYCO]: '페이코',
    [PAYMENT_METHOD.KAKAOPAY]: '카카오페이',
    [PAYMENT_METHOD.MOBILE_PHONE]: '휴대폰',
    [PAYMENT_METHOD.QUICK_TRANSFER]: '퀵계좌이체',
};

// 결제 방법 설정 매핑
export const paymentMethodConfig: Record<PaymentMethod, PaymentMethodConfig> = {
    [PAYMENT_METHOD.CARD]: {
        label: '카드',
        icon: 'credit-card',
        className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    },
    [PAYMENT_METHOD.TRANSFER]: {
        label: '계좌이체',
        icon: 'bank-account',
        className: 'bg-green-100 text-green-800 hover:bg-green-100',
    },
    [PAYMENT_METHOD.MOBILE]: {
        label: '휴대폰결제',
        icon: 'smartphone',
        className: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
    },
    [PAYMENT_METHOD.POINT]: {
        label: '포인트',
        icon: 'credit-card',
        className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    },
    [PAYMENT_METHOD.CASH]: {
        label: '현금결제',
        icon: 'banknote',
        className: 'bg-green-100 text-green-800 hover:bg-green-100',
    },
    [PAYMENT_METHOD.TOSS]: {
        label: '토스페이',
        icon: 'credit-card',
        className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    },
    [PAYMENT_METHOD.NAVERPAY]: {
        label: '네이버페이',
        icon: 'credit-card',
        className: 'bg-green-100 text-green-800 hover:bg-green-100',
    },
    [PAYMENT_METHOD.PAYCO]: {
        label: '페이코',
        icon: 'credit-card',
        className: 'bg-green-100 text-green-800 hover:bg-green-100',
    },
    [PAYMENT_METHOD.KAKAOPAY]: {
        label: '카카오페이',
        icon: 'credit-card',
        className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    },
    [PAYMENT_METHOD.MOBILE_PHONE]: {
        label: '휴대폰',
        icon: 'smartphone',
        className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    },
    [PAYMENT_METHOD.QUICK_TRANSFER]: {
        label: '퀵계좌이체',
        icon: 'bank-account',
        className: 'bg-green-100 text-green-800 hover:bg-green-100',
    },
};

// 결제 상태 매핑
export const PAYMENT_STATUS = {
    PENDING: 'pending',
    COMPLETE: 'complete',
    FAILED: 'failed',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const paymentStatusMapping: Record<PaymentStatus, string> = {
    [PAYMENT_STATUS.PENDING]: '대기',
    [PAYMENT_STATUS.COMPLETE]: '완료',
    [PAYMENT_STATUS.FAILED]: '실패',
};

// 유틸리티 함수
export const getPaymentMethodLabel = (method: PaymentMethod): string => {
    return paymentMethodMapping[method] || '';
};

export const getPaymentStatusLabel = (status: PaymentStatus): string => {
    return paymentStatusMapping[status] || '';
};
