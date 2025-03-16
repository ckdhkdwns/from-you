/**
 * ISO 8601 형식의 날짜 문자열을 읽기 쉬운 형식으로 파싱합니다.
 * @param {string} dateString - ISO 8601 형식의 날짜 문자열 (예: "2024-07-09T18:57:48+09:00")
 * @returns {string} 파싱된 날짜 문자열 (예: "2024년 7월 9일 오후 6시 57분")
 */
export const parseDate = (dateString: string) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더합니다.
    const day = date.getDate();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const ampm = hours >= 12 ? '오후' : '오전';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0시는 12시로 표시

    return `${year}년 ${month}월 ${day}일 ${ampm} ${hours}:${minutes}`;
};

export const parseDateToRelative = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 1) return '방금 전';
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export const compactParseDate = (dateString: string) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth()는 0부터 시작하므로 1을 더합니다.
    const day = date.getDate().toString().padStart(2, '0');

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 사용 예시:
// const formattedDate = parseDate("2024-07-09T18:57:48+09:00");
// console.log(formattedDate); // 출력: "2024년 7월 9일 오후 6시 57분"

export function getCurrentTimeISO8601WithOffset() {
    const now = new Date();
    const tzo = -now.getTimezoneOffset();
    const dif = tzo >= 0 ? '+' : '-';

    return (
        now.getFullYear() +
        '-' +
        String(now.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(now.getDate()).padStart(2, '0') +
        'T' +
        String(now.getHours()).padStart(2, '0') +
        ':' +
        String(now.getMinutes()).padStart(2, '0') +
        ':' +
        String(now.getSeconds()).padStart(2, '0') +
        '.' +
        String(now.getMilliseconds()).padStart(3, '0') +
        dif +
        String(Math.floor(Math.abs(tzo) / 60)).padStart(2, '0') +
        ':' +
        String(Math.abs(tzo) % 60).padStart(2, '0')
    );
}

export function getCurrentISOTime() {
    return new Date().toISOString();
}
