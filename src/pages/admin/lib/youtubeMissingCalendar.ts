import dayjs from "dayjs";

import { supabase } from "@/src/shared";

/** `game_records.status` — youtube 점검 대상 */
export const GAME_RECORD_STATUS_FINISHED = "경기 종료";

/** `game_records` 1건 — 유튜브 누락 점검용 최소 필드 */
export type YoutubeAuditGameRecord = {
  id: number;
  match_date: string;
  home_team_id: number;
  away_team_id: number;
  youtube_url: string | null;
  status: string;
};

/** 캘린더·목록에 표시할 누락 경기 1건 */
export type YoutubeMissingGameItem = {
  id: number;
  matchDate: string;
  homeTeamId: number;
  awayTeamId: number;
  /** 홈·원정 팀명 라벨 */
  matchupLabel: string;
};

/** `youtube_url` 미입력 여부 (null·빈 문자열·공백만) */
export const isMissingYoutubeUrl = (youtubeUrl: string | null): boolean =>
  youtubeUrl == null || youtubeUrl.trim() === "";

/**
 * 해당 월(`YYYY-MM`)의 경기 종료 레코드만 조회합니다.
 * 달력에 보이는 월만 가져오면 되므로 페이지네이션이 필요 없습니다.
 */
export async function fetchYoutubeAuditGameRecords(
  monthYmd: string,
): Promise<YoutubeAuditGameRecord[]> {
  const monthStart = dayjs(`${monthYmd}-01`).startOf("month");
  const fromDate = monthStart.format("YYYY-MM-DD");
  const toDate = monthStart.endOf("month").format("YYYY-MM-DD");

  const { data, error } = await supabase
    .from("game_records")
    .select("id, match_date, home_team_id, away_team_id, youtube_url, status")
    .eq("status", GAME_RECORD_STATUS_FINISHED)
    .gte("match_date", fromDate)
    .lte("match_date", toDate)
    .order("match_date", { ascending: true });

  if (error) throw error;
  return (data ?? []) as YoutubeAuditGameRecord[];
}

/**
 * 경기 종료 레코드 중 youtube 누락 건을 `match_date`별로 묶습니다.
 * @returns 키 `YYYY-MM-DD`, 값 해당 날짜 누락 경기 목록(경기 id 오름차순)
 */
export const groupYoutubeMissingByMatchDate = (
  records: YoutubeAuditGameRecord[],
  teamLabelById: Map<number, string>,
): Map<string, YoutubeMissingGameItem[]> => {
  const byDate = new Map<string, YoutubeMissingGameItem[]>();

  for (const r of records) {
    if (r.status !== GAME_RECORD_STATUS_FINISHED) continue;
    if (!isMissingYoutubeUrl(r.youtube_url)) continue;

    const homeLabel = teamLabelById.get(r.home_team_id) ?? `#${r.home_team_id}`;
    const awayLabel = teamLabelById.get(r.away_team_id) ?? `#${r.away_team_id}`;

    const item: YoutubeMissingGameItem = {
      id: r.id,
      matchDate: r.match_date,
      homeTeamId: r.home_team_id,
      awayTeamId: r.away_team_id,
      matchupLabel: `${homeLabel} vs ${awayLabel}`,
    };

    const list = byDate.get(r.match_date) ?? [];
    list.push(item);
    byDate.set(r.match_date, list);
  }

  for (const [, list] of byDate) {
    list.sort((a, b) => a.id - b.id);
  }

  return byDate;
};

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

/** 월 달력 그리드 1칸 */
export type YoutubeAuditCalendarCell = {
  /** 그리드 표시용 `YYYY-MM-DD`. 이번 달 밖이면 `null` */
  dateYmd: string | null;
  dayOfMonth: number | null;
  missingGames: YoutubeMissingGameItem[];
};

/**
 * `monthYmd`(YYYY-MM) 기준 달력 그리드(일요일 시작, 6주 고정)를 만듭니다.
 */
export const buildYoutubeAuditMonthGrid = (
  monthYmd: string,
  missingByDate: Map<string, YoutubeMissingGameItem[]>,
): YoutubeAuditCalendarCell[] => {
  const monthStart = dayjs(`${monthYmd}-01`);
  const gridStart = monthStart.startOf("month").startOf("week");
  const cells: YoutubeAuditCalendarCell[] = [];

  for (let i = 0; i < 42; i += 1) {
    const d = gridStart.add(i, "day");
    const inMonth = d.month() === monthStart.month();
    const dateYmd = inMonth ? d.format("YYYY-MM-DD") : null;
    cells.push({
      dateYmd,
      dayOfMonth: inMonth ? d.date() : null,
      missingGames: dateYmd != null ? (missingByDate.get(dateYmd) ?? []) : [],
    });
  }

  return cells;
};

export { WEEKDAY_LABELS };
