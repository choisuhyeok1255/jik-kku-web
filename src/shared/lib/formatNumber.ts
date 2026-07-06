/**
 * 사람이 읽는 큰 수(카운트·금액 등)에 천 단위 콤마를 붙인다.
 * 화면에서 `toLocaleString`을 인라인으로 부르지 말고 이 유틸을 거친다.
 */
export const formatNumber = (value: number): string =>
  value.toLocaleString("ko-KR");
