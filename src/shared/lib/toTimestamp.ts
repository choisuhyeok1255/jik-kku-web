/**
 * ISO 8601 날짜 문자열을 밀리초 타임스탬프로 바꾼다 (날짜 선후 비교·정렬용).
 */
export const toTimestamp = (iso: string): number => new Date(iso).getTime();
