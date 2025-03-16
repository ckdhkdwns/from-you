/**
 * mm를 픽셀로 변환하는 함수 (1mm = 약 3.78px)
 * @param mm - 변환할 밀리미터 값
 * @returns 픽셀 값
 */
export const mmToPx = (mm: number) => Math.floor(mm * 3.78 * 10) / 10;
