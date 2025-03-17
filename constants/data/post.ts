/**
 * 우편 관련 상수 및 매핑 정보
 */

// 우편 유형 정보 인터페이스
export interface PostTypeItem {
    value: string;
    label: string;
    subLabel?: string;
    price: number;
    oldPrice: number;
    color: string;
    delivery: string;
    stampLabel: string;
    extraInfo?: string;
    trackable: boolean;
}

// 우편 유형 코드 상수
export const POST_TYPE = {
    REGULAR: '72',
    SEMI_REGISTERED: '79',
    REGISTERED: '76',
    EXPRESS: '78',
} as const;

export type PostType = (typeof POST_TYPE)[keyof typeof POST_TYPE];

// 우편 유형 정보 배열
export const POST_TYPES: PostTypeItem[] = [
    {
        value: POST_TYPE.EXPRESS,
        label: '익일특급',
        subLabel: '빠른등기',
        price: 4000,
        oldPrice: 4500,
        color: '#F17B4D',
        delivery: '발송 다음날 도착',
        stampLabel: '익일\n특급',
        trackable: true,
    },
    {
        value: POST_TYPE.SEMI_REGISTERED,
        label: '준등기우편',
        subLabel: '등기추적 가능',
        price: 2000,
        oldPrice: 3000,
        color: '#40B822',
        delivery: '평균 3일 이내',
        stampLabel: '준\n등기',
        extraInfo: '[사서함주소는 등기와 동일]',
        trackable: true,
    },
    {
        value: POST_TYPE.REGISTERED,
        label: '일반등기',
        subLabel: '일반등기',
        price: 2700,
        oldPrice: 3500,
        color: '#4BB3D7',
        delivery: '평균 2일 이내',
        stampLabel: '등기\n우편',
        trackable: true,
    },
    {
        value: POST_TYPE.REGULAR,
        label: '일반우편',
        price: 800,
        oldPrice: 1500,
        color: '#FFBD16',
        delivery: '3~5일',
        stampLabel: '일반\n우편',
        trackable: false,
    },
];

// 우편 유형 코드에서 라벨을 가져오는 매핑 객체
export const postTypeMapping: Record<string, string> = POST_TYPES.reduce(
    (acc, type) => ({
        ...acc,
        [type.value]: type.label,
    }),
    {},
);

// 유틸리티 함수
/**
 * 우편 유형 코드로 해당 우편 유형 정보를 찾는 함수
 */
export const getPostTypeByValue = (value: string): PostTypeItem | undefined => {
    return POST_TYPES.find(type => type.value === value);
};

/**
 * 우편 유형 코드로 해당 우편 유형 라벨을 찾는 함수
 */
export const getPostTypeLabel = (value: string): string => {
    return postTypeMapping[value] || '';
};

/**
 * 우편 유형 코드로 가격을 찾는 함수
 */
export const getPostTypePrice = (value: string): number => {
    return POST_TYPES.find(type => type.value === value)?.price || 0;
};
