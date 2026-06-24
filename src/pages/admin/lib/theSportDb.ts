/**
 * TheSportsDB v2 KBO **오늘 경기 결과** — `schedule/previous`·`schedule/next`에서
 * KST 오늘(`dateEvent`) 경기만 모읍니다. 클라이언트는 `/api/thesportsdb/*` 프록시만 호출.
 * @see https://www.thesportsdb.com/documentation
 */

import dayjs from "dayjs";

const THESPORTSDB_PROXY_BASE = "/api/thesportsdb";

/** TheSportsDB `Korean KBO League` (`idLeague`) */
export const THESPORTSDB_KBO_LEAGUE_ID = 4830;

/** TheSportsDB 경기 ID (`idEvent`, 숫자 문자열 예: `"2400229"`) */
export type TheSportsDbEventId = string;

/**
 * TheSportsDB 야구(KBO·MLB) `strStatus` 코드.
 * @see https://www.thesportsdb.com/forum_topic.php?t=5236
 */
export type TheSportsDbBaseballScheduleStatus =
  | "NS" // Not Started — 경기 전
  | "IN1" // Inning 1 (In Play)
  | "IN2"
  | "IN3"
  | "IN4"
  | "IN5"
  | "IN6"
  | "IN7"
  | "IN8"
  | "IN9"
  | "POST" // Postponed — 연기
  | "CANC" // Cancelled — 취소
  | "INTR" // Interrupted — 중단
  | "ABD" // Abandoned — 몰수·기권 등
  | "FT"; // Finished — 경기 종료

/**
 * `KboTodayGameResult.status` — 야구 코드 + API 레거시(`PST` 등) 허용.
 * 일부 시즌 데이터는 연기를 `PST`(축구식)로 내려줄 수 있음.
 */
export type TheSportsDbScheduleStatus =
  | TheSportsDbBaseballScheduleStatus
  | "PST"
  | (string & {});

/**
 * 오늘 KBO 경기 1건 — `fetchKboTodayGameResults`의 `games` 항목.
 *
 * @example
 * {
 *   "idEvent": "2400229",
 *   "homeTeam": "Doosan Bears",
 *   "awayTeam": "KT Wiz",
 *   "homeScore": 2,
 *   "awayScore": 6,
 *   "status": "FT",
 *   "dateEvent": "2026-06-16",
 *   "eventTime": null
 * }
 */
export type KboTodayGameResult = {
  idEvent: TheSportsDbEventId;
  homeTeam: string;
  awayTeam: string;
  /** TheSportsDB `intHomeScore`. `0` 포함 숫자, 없으면 `null` */
  homeScore: number | null;
  /** TheSportsDB `intAwayScore`. `0` 포함 숫자, 없으면 `null` */
  awayScore: number | null;
  status: TheSportsDbScheduleStatus;
  /** TheSportsDB `dateEvent` (`YYYY-MM-DD`) */
  dateEvent: string;
  /** TheSportsDB `strEventTime`. schedule에 없으면 `null` */
  eventTime: string | null;
  /** TheSportsDB `strVideo` → `game_records.youtube_url`. 없으면 `null` */
  youtubeUrl: string | null;
};

/** `fetchKboGameResultsByDate` — 지정 날짜 `games` 항목 */
export type KboDateGameResults = {
  /** 조회 시각 (ISO 8601 UTC) */
  fetchedAt: string;
  /** 조회 대상 `dateEvent` (`YYYY-MM-DD`) */
  matchDate: string;
  /** TheSportsDB KBO 리그 ID — `4830` */
  leagueId: typeof THESPORTSDB_KBO_LEAGUE_ID;
  games: KboTodayGameResult[];
};

/**
 * `fetchKboRecentGameResults` — 오늘·어제(KST) 각 `games` 항목.
 */
export type KboTodayGameResults = {
  /** 조회 시각 (ISO 8601 UTC) */
  fetchedAt: string;
  /** 오늘 KST `YYYY-MM-DD` */
  todayKst: string;
  /** 어제 KST `YYYY-MM-DD` */
  yesterdayKst: string;
  /** TheSportsDB KBO 리그 ID — `4830` */
  leagueId: typeof THESPORTSDB_KBO_LEAGUE_ID;
  todayGames: KboTodayGameResult[];
  yesterdayGames: KboTodayGameResult[];
};

/** @deprecated `KboTodayGameResults` 사용 */
export type KboRecentGameResults = KboTodayGameResults;

/** KST 기준 `YYYY-MM-DD` */
export function getKstDateString(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** KST 기준 어제 `YYYY-MM-DD` */
export function getKstYesterdayDateString(now: Date = new Date()): string {
  return getKstDateString(new Date(now.getTime() - 24 * 60 * 60 * 1000));
}

function isEmptyTheSportsDbPayload(json: unknown): string | null {
  if (!json || typeof json !== "object") return null;
  const record = json as Record<string, unknown>;
  if (typeof record.Message === "string" && record.Message.trim()) {
    return record.Message.trim();
  }
  return null;
}

function extractEventId(row: unknown): string | null {
  if (!row || typeof row !== "object") return null;
  const id = (row as { idEvent?: unknown }).idEvent;
  if (id == null) return null;
  const text = String(id).trim();
  return text || null;
}

function isKboLeagueRow(row: unknown, leagueId: number): boolean {
  if (!row || typeof row !== "object") return false;
  return (
    String((row as { idLeague?: unknown }).idLeague ?? "") === String(leagueId)
  );
}

function parseApiScore(value: unknown): number | null {
  if (value == null || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const trimmed = String(value).trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

/** schedule `strVideo` → YouTube URL. 빈 문자열이면 `null` */
function parseStrVideo(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function parseTodayGameResult(row: unknown): KboTodayGameResult | null {
  if (!row || typeof row !== "object") return null;
  const event = row as {
    idEvent?: unknown;
    strHomeTeam?: unknown;
    strAwayTeam?: unknown;
    intHomeScore?: unknown;
    intAwayScore?: unknown;
    strStatus?: unknown;
    dateEvent?: unknown;
    strEventTime?: unknown;
    strVideo?: unknown;
  };

  const idEvent = extractEventId(row);
  const homeTeam =
    typeof event.strHomeTeam === "string" ? event.strHomeTeam.trim() : "";
  const awayTeam =
    typeof event.strAwayTeam === "string" ? event.strAwayTeam.trim() : "";
  if (!idEvent || !homeTeam || !awayTeam) return null;

  return {
    idEvent,
    homeTeam,
    awayTeam,
    homeScore: parseApiScore(event.intHomeScore),
    awayScore: parseApiScore(event.intAwayScore),
    status:
      typeof event.strStatus === "string" && event.strStatus.trim()
        ? (event.strStatus.trim() as TheSportsDbScheduleStatus)
        : "Unknown",
    dateEvent:
      typeof event.dateEvent === "string"
        ? event.dateEvent
        : getKstDateString(),
    eventTime:
      typeof event.strEventTime === "string" && event.strEventTime.trim()
        ? event.strEventTime.trim()
        : null,
    youtubeUrl: parseStrVideo(event.strVideo),
  };
}

async function fetchTheSportsDbSchedule(path: string): Promise<unknown[]> {
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  const response = await fetch(`${THESPORTSDB_PROXY_BASE}/${normalized}`, {
    headers: { Accept: "application/json" },
  });

  const json = (await response.json()) as unknown;

  if (response.status === 429) {
    throw new Error(
      "TheSportsDB 요청 한도(429)를 초과했습니다. 잠시 후 다시 시도해 주세요.",
    );
  }

  if (!response.ok) {
    const proxyError =
      json &&
      typeof json === "object" &&
      "error" in json &&
      typeof (json as { error: unknown }).error === "string"
        ? (json as { error: string }).error
        : null;
    const message =
      proxyError ??
      isEmptyTheSportsDbPayload(json) ??
      `HTTP ${response.status}`;
    throw new Error(`TheSportsDB v2 요청 실패: ${message}`);
  }

  const emptyMessage = isEmptyTheSportsDbPayload(json);
  if (emptyMessage) {
    throw new Error(`TheSportsDB v2 요청 실패: ${emptyMessage}`);
  }

  if (!json || typeof json !== "object") return [];
  const schedule = (json as { schedule?: unknown }).schedule;
  return Array.isArray(schedule) ? schedule : [];
}

function collectGamesForDates(
  rows: unknown[],
  leagueId: number,
  dates: Set<string>,
): Map<string, KboTodayGameResult[]> {
  const byDate = new Map<string, Map<string, KboTodayGameResult>>();
  for (const date of dates) {
    byDate.set(date, new Map());
  }

  for (const row of rows) {
    if (!isKboLeagueRow(row, leagueId)) continue;
    const dateEvent = (row as { dateEvent?: unknown }).dateEvent;
    if (typeof dateEvent !== "string" || !dates.has(dateEvent)) continue;
    const parsed = parseTodayGameResult(row);
    if (!parsed) continue;
    byDate.get(dateEvent)?.set(parsed.idEvent, parsed);
  }

  const result = new Map<string, KboTodayGameResult[]>();
  for (const [date, map] of byDate) {
    const games = [...map.values()].sort((a, b) => {
      const timeA = a.eventTime ?? "";
      const timeB = b.eventTime ?? "";
      return timeA.localeCompare(timeB) || a.idEvent.localeCompare(b.idEvent);
    });
    result.set(date, games);
  }
  return result;
}

/**
 * KBO **오늘·어제(KST) 경기 결과**를 schedule API에서 한 번에 조회합니다.
 */
export async function fetchKboRecentGameResults(): Promise<KboTodayGameResults> {
  const todayKst = getKstDateString();
  const yesterdayKst = getKstYesterdayDateString();
  const leagueId = THESPORTSDB_KBO_LEAGUE_ID;
  const targetDates = new Set([todayKst, yesterdayKst]);

  const [previousRows, nextRows] = await Promise.all([
    fetchTheSportsDbSchedule(`/schedule/previous/league/${leagueId}`),
    fetchTheSportsDbSchedule(`/schedule/next/league/${leagueId}`),
  ]);

  const grouped = collectGamesForDates(
    [...previousRows, ...nextRows],
    leagueId,
    targetDates,
  );

  return {
    fetchedAt: new Date().toISOString(),
    todayKst,
    yesterdayKst,
    leagueId,
    todayGames: grouped.get(todayKst) ?? [],
    yesterdayGames: grouped.get(yesterdayKst) ?? [],
  };
}

/** @deprecated `fetchKboRecentGameResults` 사용 */
export async function fetchKboTodayGameResults(): Promise<KboTodayGameResults> {
  return fetchKboRecentGameResults();
}

/**
 * KBO 시즌 schedule에서 **지정 날짜(`dateEvent`)** 경기만 조회합니다.
 * @see `/schedule/league/{leagueId}/{seasonYear}`
 */
export async function fetchKboGameResultsByDate(
  matchDate: string,
): Promise<KboDateGameResults> {
  const leagueId = THESPORTSDB_KBO_LEAGUE_ID;
  const seasonYear = matchDate.slice(0, 4);
  const rows = await fetchTheSportsDbSchedule(
    `/schedule/league/${leagueId}/${seasonYear}`,
  );
  const grouped = collectGamesForDates(
    rows,
    leagueId,
    new Set([matchDate]),
  );

  return {
    fetchedAt: new Date().toISOString(),
    matchDate,
    leagueId,
    games: grouped.get(matchDate) ?? [],
  };
}

/**
 * KBO 시즌 schedule에서 **해당 월(`YYYY-MM`)** 경기만 조회합니다.
 * 7번 유튜브 누락 달력 TheSportsDB O/X 표시용.
 */
export async function fetchKboGameResultsForMonth(
  monthYmd: string,
): Promise<KboTodayGameResult[]> {
  const leagueId = THESPORTSDB_KBO_LEAGUE_ID;
  const seasonYear = monthYmd.slice(0, 4);
  const monthStart = dayjs(`${monthYmd}-01`).startOf("month");
  const monthDates = new Set<string>();
  for (let i = 0; i < monthStart.daysInMonth(); i += 1) {
    monthDates.add(monthStart.add(i, "day").format("YYYY-MM-DD"));
  }

  const rows = await fetchTheSportsDbSchedule(
    `/schedule/league/${leagueId}/${seasonYear}`,
  );
  const grouped = collectGamesForDates(rows, leagueId, monthDates);
  return [...grouped.values()].flat();
}

/** KBO 오늘·어제 경기 결과를 브라우저 콘솔에 출력합니다. */
export async function logKboRecentGameResults(): Promise<KboTodayGameResults> {
  const result = await fetchKboRecentGameResults();
  console.log(result);
  return result;
}

/** @deprecated `logKboRecentGameResults` 사용 */
export async function logKboTodayGameResults(): Promise<KboTodayGameResults> {
  return logKboRecentGameResults();
}
