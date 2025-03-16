/**
 * 고유한 주문 ID를 생성합니다.
 * 형식: FY-YYYYMMDD-HHMMSS-XXXX (FY: FromYou, XXXX: 랜덤 문자열)
 * 예시: FY-20240301-123045-A7B9
 *
 * @param prefix 주문 ID 접두사 (기본값: 'FY')
 * @returns 생성된 주문 ID 문자열
 */
export function generateOrderId(prefix: string = 'FY'): string {
    // 현재 날짜와 시간 정보 가져오기
    const now = new Date();

    // 날짜 부분: YYYYMMDD
    const datePart =
        now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0');

    // 시간 부분: HHMMSS
    const timePart =
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');

    // 랜덤 문자열 생성 (4자리 영숫자)
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();

    // 최종 주문 ID 조합
    return `${prefix}-${datePart}-${timePart}-${randomPart}`;
}

/**
 * 주문 ID가 유효한지 검증합니다.
 *
 * @param orderId 검증할 주문 ID
 * @param expectedPrefix 예상되는 접두사 (기본값: 'FY')
 * @returns 유효성 여부 (boolean)
 */
export function validateOrderId(orderId: string, expectedPrefix: string = 'FY'): boolean {
    // 기본 형식 검증 (FY-YYYYMMDD-HHMMSS-XXXX)
    const regex = new RegExp(`^${expectedPrefix}-\\d{8}-\\d{6}-[A-Z0-9]{4}$`);
    return regex.test(orderId);
}

/**
 * 주문 ID에서 날짜 정보를 추출합니다.
 *
 * @param orderId 주문 ID
 * @returns 주문 날짜 (Date 객체) 또는 유효하지 않은 경우 null
 */
export function getOrderDateFromId(orderId: string): Date | null {
    try {
        const parts = orderId.split('-');
        if (parts.length !== 4) return null;

        const datePart = parts[1]; // YYYYMMDD
        const timePart = parts[2]; // HHMMSS

        const year = parseInt(datePart.substring(0, 4));
        const month = parseInt(datePart.substring(4, 6)) - 1; // 0-based month
        const day = parseInt(datePart.substring(6, 8));

        const hour = parseInt(timePart.substring(0, 2));
        const minute = parseInt(timePart.substring(2, 4));
        const second = parseInt(timePart.substring(4, 6));

        return new Date(year, month, day, hour, minute, second);
    } catch {
        return null;
    }
}
