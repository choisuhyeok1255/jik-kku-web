import type { GameStatus } from "kbo-game";

/** KBO 경기 스코어(`kbo-game` `Game.score`와 동일 구조) */
export type KboGameScore = {
  home: number;
  away: number;
};

/**
 * `/api/kbo/kbo-game` 응답 한 행 — `getGame` 결과를 JSON으로 보내면 `date`는 ISO 문자열로 직렬화됩니다.
 * (런타임 `Game.date`는 `Date`이나, 클라이언트 `res.json()` 이후에는 문자열입니다.)
 */
export type KboGameListItem = {
  id: string;
  /** ISO 8601 (예: `2026-04-28T00:00:00.000Z`) */
  date: string;
  startTime: string;
  stadium: string;
  homeTeam: string;
  awayTeam: string;
  homePitcher: string;
  awayPitcher: string;
  winPitcher: string;
  losePitcher: string;
  savePitcher: string;
  status: GameStatus;
  score: KboGameScore;
  currentInning: number | null;
  broadcastServices: string[];
  season: number;
};

/** `/api/kbo/kbo-game` 성공 시 본문 — 경기 없으면 `null`일 수 있음 */
export type KboGameListResponse = KboGameListItem[] | null;
