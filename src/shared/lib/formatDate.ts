/**
 * 날짜를 화면 표시용 문자열로 바꾼다 (기본 `YYYY-MM-DD`).
 * - 실행 환경의 로컬 시간대 기준이다. 브라우저(클라이언트 컴포넌트)에서 쓰는 것을 전제로 한다.
 * - 새로 작성하는 화면 코드는 `dayjs(...).format`을 인라인으로 부르지 말고 이 유틸을 거친다.
 */
import dayjs from "dayjs";

export const formatDate = (
  value: string | Date,
  pattern = "YYYY-MM-DD",
): string => dayjs(value).format(pattern);
