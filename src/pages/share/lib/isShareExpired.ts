/**
 * 마감일 기준으로 나눔이 마감되었는지 확인
 * - deadline이 null이면 마감 없음 → 진행 중
 * - deadline이 설정되어 있으면 현재 시간과 비교 (날짜+시간 포함)
 * - 현재 시간이 마감일을 지났으면 마감됨
 */
export const isShareExpired = (deadline: string | null): boolean => {
  if (!deadline) return false;
  return new Date() >= new Date(deadline);
};
