export const STEP_KEYS = {
    LETTER_CONTENT: 'LETTER_CONTENT',
    PHOTO: 'PHOTO',
    ADDRESS: 'ADDRESS',
    POST_TYPES: 'POST_TYPES',
    // INFO: "INFO",
    PAYMENT: 'PAYMENT',
} as const;

export const STEP_STATUS = {
    IN_PROGRESS: '진행중',
    WAITING: '대기',
} as const;

export type StepKey = keyof typeof STEP_KEYS;

export interface Step {
    title: string;
    subtitle: string;
    key: StepKey;
}

export const STEP_INFO: Record<StepKey, Step> = {
    [STEP_KEYS.LETTER_CONTENT]: {
        title: '편지작성',
        subtitle: STEP_STATUS.IN_PROGRESS,
        key: STEP_KEYS.LETTER_CONTENT,
    },
    [STEP_KEYS.PHOTO]: {
        title: '사진선택',
        subtitle: STEP_STATUS.WAITING,
        key: STEP_KEYS.PHOTO,
    },
    [STEP_KEYS.ADDRESS]: {
        title: '주소입력',
        subtitle: STEP_STATUS.WAITING,
        key: STEP_KEYS.ADDRESS,
    },
    [STEP_KEYS.POST_TYPES]: {
        title: '우편선택',
        subtitle: STEP_STATUS.WAITING,
        key: STEP_KEYS.POST_TYPES,
    },
    // [STEP_KEYS.INFO]: {
    //     title: "편지확인",
    //     subtitle: STEP_STATUS.WAITING,
    //     key: STEP_KEYS.INFO,
    // },
    [STEP_KEYS.PAYMENT]: {
        title: '주문/결제',
        subtitle: STEP_STATUS.WAITING,
        key: STEP_KEYS.PAYMENT,
    },
};

export const letterSequence: StepKey[] = [
    STEP_KEYS.LETTER_CONTENT,
    STEP_KEYS.PHOTO,
    STEP_KEYS.ADDRESS,
    STEP_KEYS.POST_TYPES,
    // STEP_KEYS.INFO,
    STEP_KEYS.PAYMENT,
] as StepKey[];

export const adminLetterSequence: StepKey[] = [
    STEP_KEYS.LETTER_CONTENT,
    STEP_KEYS.PHOTO,
    STEP_KEYS.ADDRESS,
    STEP_KEYS.POST_TYPES,
    // STEP_KEYS.INFO,
    STEP_KEYS.PAYMENT,
] as StepKey[];
