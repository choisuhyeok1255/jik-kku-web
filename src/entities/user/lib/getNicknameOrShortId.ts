/**
 * 화면에 표시할 유저 이름을 정한다.
 * 닉네임을 찾았으면 닉네임을, 못 찾았으면(조회 실패·탈퇴 등으로 값이 없음) user id 앞 8자리 + "..."를 돌려준다.
 * @param userId 유저 id (uuid)
 * @param nickname 조회한 닉네임 (못 찾았으면 넘기지 않는다)
 */
export const getNicknameOrShortId = (
  userId: string,
  nickname?: string,
): string => nickname ?? `${userId.slice(0, 8)}...`;
