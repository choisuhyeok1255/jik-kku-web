import dayjs from "dayjs";

import type { KboGameListItem } from "@/src/entities/kbo/model/types/kbo-game";
import type { TeamServerModel } from "@/src/entities/team/model/types/api";

import type { KboTodayGameResult } from "./theSportDb";

export const pad2 = (n: number) => String(n).padStart(2, "0");

/** `YYMMDD`(6) + 홈 team_id(2) + 원정 team_id(2) + 같은 날 같은 대전 순번(2) = 총 12자리 숫자 id */
export const buildGameRecordId = (
  yymmdd: string,
  homeTeamId: number,
  awayTeamId: number,
  sequence: number,
) =>
  `${yymmdd}${pad2(homeTeamId)}${pad2(awayTeamId)}${pad2(sequence)}`;

export const matchTeamId = (
  teams: TeamServerModel[],
  kboName: string,
): number | null => {
  const trimmed = kboName.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  for (const t of teams) {
    if (t.short_team_name?.trim().toLowerCase() === lower) return t.id;
    if (t.team_name?.includes(trimmed)) return t.id;
    const en = t.team_name_en?.toLowerCase();
    if (en && (lower.includes(en) || en.includes(lower))) return t.id;
  }
  return null;
};

export type PreviewRow = {
  id: string;
  idEvent: string;
  strTime: string;
  strTimestamp: string;
  matchDate: string;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamId: number | null;
  awayTeamId: number | null;
  stadiumId: number | null;
  sequence: number;
  issues: string[];
};

/** kbo-game `startTime`(HH:mm) + 경기일 → 정렬에 쓰는 `strTimestamp`용 epoch ms 문자열 */
const kboStartToTimestampStr = (matchDateYmd: string, startTime: string) => {
  const t = startTime.trim();
  const hms = t.split(":").length === 2 ? `${t}:00` : t;
  return String(dayjs(`${matchDateYmd}T${hms}+09:00`).valueOf());
};

/** kbo-game(`/api/kbo/kbo-game`) 응답을 `PreviewRow`로 변환합니다. 팀 매칭은 `matchTeamId` */
export const buildPreviewRowsFromKboGame = (
  games: KboGameListItem[],
  teams: TeamServerModel[],
  matchDateYmd: string,
): PreviewRow[] => {
  const yymmdd = dayjs(matchDateYmd).format("YYMMDD");
  const chronological = [...games].sort(
    (a, b) =>
      Number(kboStartToTimestampStr(matchDateYmd, a.startTime)) -
      Number(kboStartToTimestampStr(matchDateYmd, b.startTime)),
  );

  const pairCounters = new Map<string, number>();
  const rows: PreviewRow[] = [];

  for (const g of chronological) {
    const homeId = matchTeamId(teams, g.homeTeam);
    const awayId = matchTeamId(teams, g.awayTeam);
    const issues: string[] = [];
    if (homeId === null) issues.push(`홈팀 미매칭: ${g.homeTeam}`);
    if (awayId === null) issues.push(`원정 미매칭: ${g.awayTeam}`);

    let seq = 1;
    if (homeId !== null && awayId !== null) {
      const key = `${homeId}-${awayId}`;
      const next = (pairCounters.get(key) ?? 0) + 1;
      pairCounters.set(key, next);
      seq = next;
    }

    const stadiumId =
      homeId !== null
        ? (teams.find((t) => t.id === homeId)?.stadium_id ?? null)
        : null;
    if (homeId !== null && stadiumId === null) {
      issues.push("홈팀에 stadium_id 없음");
    }

    const strTimestamp = kboStartToTimestampStr(matchDateYmd, g.startTime);
    const strTime =
      g.startTime.split(":").length === 2
        ? `${g.startTime}:00`
        : g.startTime;

    let id = "";
    if (homeId !== null && awayId !== null) {
      id = buildGameRecordId(yymmdd, homeId, awayId, seq);
    }

    rows.push({
      id,
      idEvent: g.id,
      strTime,
      strTimestamp,
      matchDate: matchDateYmd,
      homeTeamName: g.homeTeam,
      awayTeamName: g.awayTeam,
      homeTeamId: homeId,
      awayTeamId: awayId,
      stadiumId,
      sequence: seq,
      issues,
    });
  }

  return rows.sort(
    (a, b) =>
      (Number.parseInt(b.strTimestamp, 10) || 0) -
      (Number.parseInt(a.strTimestamp, 10) || 0),
  );
};

/** TheSportsDB 오늘 경기 → DB upsert 미리보기 1행 */
export type TheSportsDbPreviewRow = {
  id: string;
  idEvent: string;
  matchDate: string;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamId: number | null;
  awayTeamId: number | null;
  stadiumId: number | null;
  sequence: number;
  homeScore: number | null;
  awayScore: number | null;
  /** `game_records.status`에 넣을 한국어 상태 */
  status: string;
  /** TheSportsDB `strStatus` 원본 */
  apiStatus: string;
  /** TheSportsDB `strVideo` → `game_records.youtube_url` */
  youtubeUrl: string | null;
  issues: string[];
};

/** TheSportsDB `strStatus`가 경기 종료(FT)인지 */
export const isTheSportsDbFinishedStatus = (apiStatus: string): boolean =>
  apiStatus.trim().toUpperCase() === "FT";

/** FT 경기 — API가 `null`로 준 점수는 0득점으로 간주 */
const normalizeTheSportsDbFtScore = (score: number | null): number =>
  score ?? 0;

/**
 * TheSportsDB → `game_records` upsert용 점수·status·youtube.
 * FT만 점수·youtube 반영( null 점수 → 0 ). 그 외는 점수·youtube null.
 */
export const resolveTheSportsDbDbGameFields = (input: {
  apiStatus: string;
  homeScore: number | null;
  awayScore: number | null;
  youtubeUrl: string | null;
}): Pick<
  TheSportsDbPreviewRow,
  "homeScore" | "awayScore" | "status" | "youtubeUrl"
> => {
  const status = mapTheSportsDbStatusToDbStatus(input.apiStatus);
  if (isTheSportsDbFinishedStatus(input.apiStatus)) {
    return {
      homeScore: normalizeTheSportsDbFtScore(input.homeScore),
      awayScore: normalizeTheSportsDbFtScore(input.awayScore),
      status,
      youtubeUrl: input.youtubeUrl,
    };
  }
  return {
    homeScore: null,
    awayScore: null,
    status,
    youtubeUrl: null,
  };
};

/** 5번 TheSportsDB `strStatus` → `game_records.status` */
export const mapTheSportsDbStatusToDbStatus = (apiStatus: string): string => {
  const code = apiStatus.trim().toUpperCase();
  if (code === "FT") return "경기 종료";
  // POST/PST(연기)·ABD(몰수·우천취소) → 우천 취소
  if (code === "POST" || code === "PST" || code === "ABD") return "우천 취소";
  // NS 및 그 외(IN1~9, CANC 등) 전부 경기 전
  return "경기 전";
};

/** 미리보기 테이블 점수 — `0`은 `"0"`, null/undefined만 `—` */
export const formatPreviewScore = (score: number | null | undefined): string =>
  score === null || score === undefined ? "—" : String(score);

/**
 * `fetchKboRecentGameResults`의 `games`를 DB upsert용 미리보기 행으로 변환합니다.
 * 팀 매칭은 TheSportsDB 영문 팀명(`strHomeTeam` 등) → `matchTeamId`.
 */
export const buildPreviewRowsFromTheSportsDb = (
  games: KboTodayGameResult[],
  teams: TeamServerModel[],
): TheSportsDbPreviewRow[] => {
  const chronological = [...games].sort((a, b) => {
    const timeA = a.eventTime ?? "";
    const timeB = b.eventTime ?? "";
    return timeA.localeCompare(timeB) || a.idEvent.localeCompare(b.idEvent);
  });

  const pairCounters = new Map<string, number>();
  const rows: TheSportsDbPreviewRow[] = [];

  for (const g of chronological) {
    const homeId = matchTeamId(teams, g.homeTeam);
    const awayId = matchTeamId(teams, g.awayTeam);
    const issues: string[] = [];
    if (homeId === null) issues.push(`홈팀 미매칭: ${g.homeTeam}`);
    if (awayId === null) issues.push(`원정 미매칭: ${g.awayTeam}`);

    let seq = 1;
    if (homeId !== null && awayId !== null) {
      const key = `${homeId}-${awayId}`;
      const next = (pairCounters.get(key) ?? 0) + 1;
      pairCounters.set(key, next);
      seq = next;
    }

    const stadiumId =
      homeId !== null
        ? (teams.find((t) => t.id === homeId)?.stadium_id ?? null)
        : null;
    if (homeId !== null && stadiumId === null) {
      issues.push("홈팀에 stadium_id 없음");
    }

    const yymmdd = dayjs(g.dateEvent).format("YYMMDD");
    let id = "";
    if (homeId !== null && awayId !== null) {
      id = buildGameRecordId(yymmdd, homeId, awayId, seq);
    }

    const dbFields = resolveTheSportsDbDbGameFields({
      apiStatus: g.status,
      homeScore: g.homeScore,
      awayScore: g.awayScore,
      youtubeUrl: g.youtubeUrl,
    });

    rows.push({
      id,
      idEvent: g.idEvent,
      matchDate: g.dateEvent,
      homeTeamName: g.homeTeam,
      awayTeamName: g.awayTeam,
      homeTeamId: homeId,
      awayTeamId: awayId,
      stadiumId,
      sequence: seq,
      homeScore: dbFields.homeScore,
      awayScore: dbFields.awayScore,
      status: dbFields.status,
      apiStatus: g.status,
      youtubeUrl: dbFields.youtubeUrl,
      issues,
    });
  }

  return rows.sort(
    (a, b) => (Number(a.id) || 0) - (Number(b.id) || 0) || a.idEvent.localeCompare(b.idEvent),
  );
};

/** TheSportsDB 미리보기 행이 DB upsert 가능한지 확인 */
export const isValidTheSportsDbPreviewForInsert = (
  row: TheSportsDbPreviewRow,
): boolean =>
  !!row.id &&
  row.homeTeamId != null &&
  row.awayTeamId != null &&
  row.stadiumId != null &&
  row.issues.length === 0;
