export const FAQ_CATEGORIES = ['우편', '작성방법', '포인트'] as const;
export type FAQCategory = (typeof FAQ_CATEGORIES)[number];
