import { PaymentStatus, ShippingStatus } from '@/models/types/letter';

export const getStatusText = ({
    paymentStatus,
    shippingStatus,
}: {
    paymentStatus: PaymentStatus;
    shippingStatus: ShippingStatus;
}) => {
    if (shippingStatus === 'complete') {
        return '배송 완료';
    }
    if (shippingStatus === 'shipping') {
        return '배송 중';
    }
    if (shippingStatus === 'failed') {
        return '배송 실패';
    }

    if (paymentStatus === 'pending') {
        return '결제 대기중';
    }
    if (paymentStatus === 'complete') {
        return '결제 완료';
    }
    if (paymentStatus === 'failed') {
        return '결제 실패';
    }
};
