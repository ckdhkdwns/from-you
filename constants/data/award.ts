export const POINT_RATE = {
    // 리뷰 관련 포인트
    REVIEW: {
        type: 'percent',
        rate: 0.01,
    },
    BEST_REVIEW: {
        type: 'constant',
        amount: 3000,
    },

    // 결제 수단별 포인트 적립률
    // 일반 결제 수단
    transfer: {
        type: 'percent',
        rate: 0.03,
    },
    card: {
        type: 'percent',
        rate: 0.012,
    },
    mobile: {
        type: 'percent',
        rate: 0.01,
    },
    point: {
        type: 'percent',
        rate: 0.0,
    },
    cash: {
        type: 'percent',
        rate: 0.01,
    },

    // 토스페이먼츠 결제 수단별 적립률
    CARD: {
        type: 'percent',
        rate: 0.012,
    },

    // 기본 적립률 (다른 결제 수단에 대한 기본값)
    default: {
        type: 'percent',
        rate: 0.01,
    },
};
