import dayjs from "dayjs";

import type { KboGameListItem } from "@/src/entities/kbo/model/types/kbo-game";
import type { TeamServerModel } from "@/src/entities/team/model/types/api";

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
