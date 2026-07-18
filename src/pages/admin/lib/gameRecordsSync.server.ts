import "server-only";

import type { TeamServerModel } from "@/src/entities/team/model/types/api";
import { createAdminClient } from "@/src/shared/lib/supabase/admin";
import type { Database } from "@/src/shared/lib/supabase.types";

import {
  buildPreviewRowsFromTheSportsDb,
  isValidTheSportsDbPreviewForInsert,
  resolveTheSportsDbDbGameFields,
} from "./gameRecordsAdmin";
import {
  fetchKboRecentGameResults,
  type ScheduleHttpClient,
} from "./theSportDb";

/**
 * 크론용 경기 기록 자동 동기화 (서버 전용).
 * - TheSportsDB 어제·오늘(KST) 경기 → `game_records` upsert.
 * - 유튜브 URL은 새 값이 있을 때만 갱신하고 기존 값(수기 입력 포함)은 보존한다.
 * - 이미 확정된 경기("경기 종료"/"우천 취소")는 "경기 전"으로 되돌리지 않는다(결과·점수 보호).
 * - 실제 변경(신규/점수·상태·유튜브 변동)이 있는 행만 저장하고, 변경 내역을 Slack 메시지로 만든다.
 */

type GameRecordRow = Database["public"]["Tables"]["game_records"]["Row"];
type GameRecordInsert = Database["public"]["Tables"]["game_records"]["Insert"];

const THESPORTSDB_V2_BASE = "https://www.thesportsdb.com/api/v2/json";
const ADMIN_BASE_URL = "https://www.jik-kku.com";

/** 변경된 경기 1건 요약 (Slack 표시용). */
export type GameSyncChange = {
  id: number;
  matchDate: string;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  youtubeAdded: boolean;
  reason: "created" | "updated";
};

/** 동기화 1회 결과. */
export type GameSyncResult = {
  /** 실행 시각 (ISO 8601 UTC) */
  ranAt: string;
  /** upsert 후보로 검토한 유효 경기 수 */
  checked: number;
  /** 실제로 변경되어 저장한 경기 목록 */
  changed: GameSyncChange[];
  /** 팀·구장 매핑 실패로 건너뛴 경기 수 */
  skipped: number;
  /** 건너뛴 사유 목록 */
  skippedIssues: string[];
};

function getTheSportsDbApiKey(): string {
  const key =
    process.env.THESPORTSDB_KEY?.trim() ??
    process.env.NEXT_PUBLIC_THESPORTSDB_KEY?.trim();
  if (!key) {
    throw new Error(
      "THESPORTSDB_KEY(또는 NEXT_PUBLIC_THESPORTSDB_KEY)가 설정되지 않았습니다.",
    );
  }
  return key;
}

/** 서버 전용 전송 — TheSportsDB v2를 `X-API-KEY`로 직접 호출한다. */
const directScheduleHttpClient: ScheduleHttpClient = async (path) => {
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  const response = await fetch(`${THESPORTSDB_V2_BASE}/${normalized}`, {
    headers: {
      "X-API-KEY": getTheSportsDbApiKey(),
      Accept: "application/json",
    },
    cache: "no-store",
  });
  const json = await response.json().catch(() => null);
  return { status: response.status, ok: response.ok, json };
};

/** 점수·상태·유튜브가 기존 행과 달라졌는지 (신규는 항상 변경). */
function hasMeaningfulChange(
  existing: GameRecordRow | undefined,
  next: Pick<
    GameRecordInsert,
    "home_team_score" | "away_team_score" | "status" | "youtube_url"
  >,
): boolean {
  if (!existing) return true;
  return (
    existing.home_team_score !== next.home_team_score ||
    existing.away_team_score !== next.away_team_score ||
    existing.status !== next.status ||
    (existing.youtube_url ?? null) !== (next.youtube_url ?? null)
  );
}

export async function syncGameRecordsFromTheSportsDb(): Promise<GameSyncResult> {
  const ranAt = new Date().toISOString();
  const supabaseAdmin = createAdminClient();

  const { data: teamsData, error: teamsError } = await supabaseAdmin
    .from("teams")
    .select("*");
  if (teamsError) throw teamsError;
  const teams = (teamsData ?? []) as TeamServerModel[];

  const recent = await fetchKboRecentGameResults(directScheduleHttpClient);
  // seq(더블헤더 순번)는 날짜별로 계산되므로 어제·오늘을 따로 변환한다.
  const allRows = [
    ...buildPreviewRowsFromTheSportsDb(recent.yesterdayGames, teams),
    ...buildPreviewRowsFromTheSportsDb(recent.todayGames, teams),
  ];

  const validRows = allRows.filter(isValidTheSportsDbPreviewForInsert);
  const invalidRows = allRows.filter(
    (r) => !isValidTheSportsDbPreviewForInsert(r),
  );
  const skippedIssues = invalidRows.flatMap((r) => r.issues);

  if (validRows.length === 0) {
    return {
      ranAt,
      checked: 0,
      changed: [],
      skipped: invalidRows.length,
      skippedIssues,
    };
  }

  const ids = validRows.map((r) => Number(r.id));
  const { data: existingData, error: existingError } = await supabaseAdmin
    .from("game_records")
    .select("*")
    .in("id", ids);
  if (existingError) throw existingError;

  const existingById = new Map<number, GameRecordRow>();
  (existingData ?? []).forEach((r) => existingById.set(r.id, r));

  const teamNameById = new Map<number, string>();
  teams.forEach((t) =>
    teamNameById.set(t.id, t.team_name ?? t.short_team_name ?? String(t.id)),
  );

  const payloads: GameRecordInsert[] = [];
  const changed: GameSyncChange[] = [];

  for (const r of validRows) {
    const id = Number(r.id);
    const existing = existingById.get(id);
    const dbFields = resolveTheSportsDbDbGameFields({
      apiStatus: r.apiStatus,
      homeScore: r.homeScore,
      awayScore: r.awayScore,
      youtubeUrl: r.youtubeUrl,
    });

    // 유튜브: 새 값(FT의 strVideo)이 있을 때만 갱신, 없으면 기존 값 보존
    const youtubeUrl = dbFields.youtubeUrl ?? existing?.youtube_url ?? null;

    const next = {
      home_team_score: dbFields.homeScore,
      away_team_score: dbFields.awayScore,
      status: dbFields.status,
      youtube_url: youtubeUrl,
    };

    // 확정된 경기("경기 종료"/"우천 취소")를 "경기 전"으로 되돌리지 않는다.
    // TheSportsDB가 끝난 경기를 일시적으로 FT가 아닌 상태(빈 값·NS·경기중 등)로 주더라도
    // 이미 확정된 결과·점수가 날아가지 않도록 방어한다.
    if (
      existing &&
      (existing.status === "경기 종료" || existing.status === "우천 취소") &&
      next.status === "경기 전"
    ) {
      continue;
    }

    if (!hasMeaningfulChange(existing, next)) continue;

    payloads.push({
      id,
      home_team_id: r.homeTeamId!,
      away_team_id: r.awayTeamId!,
      home_team_score: next.home_team_score,
      away_team_score: next.away_team_score,
      status: next.status,
      match_date: r.matchDate,
      stadium_id: r.stadiumId!,
      youtube_url: next.youtube_url,
    });

    changed.push({
      id,
      matchDate: r.matchDate,
      homeTeamName: teamNameById.get(r.homeTeamId!) ?? r.homeTeamName,
      awayTeamName: teamNameById.get(r.awayTeamId!) ?? r.awayTeamName,
      homeScore: next.home_team_score,
      awayScore: next.away_team_score,
      status: next.status,
      youtubeAdded:
        !!dbFields.youtubeUrl &&
        (existing?.youtube_url ?? null) !== dbFields.youtubeUrl,
      reason: existing ? "updated" : "created",
    });
  }

  if (payloads.length > 0) {
    const { error: upsertError } = await supabaseAdmin
      .from("game_records")
      .upsert(payloads, { onConflict: "id" });
    if (upsertError) throw upsertError;
  }

  return {
    ranAt,
    checked: validRows.length,
    changed,
    skipped: invalidRows.length,
    skippedIssues,
  };
}

/** ISO 시각 → KST `YYYY-MM-DD HH:mm` */
function formatKst(iso: string): string {
  const kst = new Date(new Date(iso).getTime() + 9 * 60 * 60 * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${kst.getUTCFullYear()}-${p(kst.getUTCMonth() + 1)}-${p(kst.getUTCDate())} ${p(kst.getUTCHours())}:${p(kst.getUTCMinutes())}`;
}

function formatScore(score: number | null): string {
  return score === null ? "—" : String(score);
}

/** 변경 내역 → Slack Block Kit 메시지. */
export function buildSyncSlackMessage(result: GameSyncResult): object {
  const lines = result.changed.map((c) => {
    const tag = c.reason === "created" ? "신규" : "변경";
    const video = c.youtubeAdded ? " 🎥" : "";
    return `• [${tag}] ${c.matchDate} ${c.homeTeamName} ${formatScore(c.homeScore)} : ${formatScore(c.awayScore)} ${c.awayTeamName} (${c.status})${video}`;
  });

  const fields = [
    { type: "mrkdwn", text: `*동기화 시각:*\n${formatKst(result.ranAt)}` },
    { type: "mrkdwn", text: `*변경 건수:*\n${result.changed.length}건` },
    { type: "mrkdwn", text: `*검토 경기:*\n${result.checked}건` },
    { type: "mrkdwn", text: `*매핑 실패:*\n${result.skipped}건` },
  ];

  return {
    text: `⚾ 경기 데이터 자동 동기화: ${result.changed.length}건 변경`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "⚾ 경기 데이터 자동 동기화",
          emoji: true,
        },
      },
      { type: "section", fields },
      {
        type: "section",
        text: { type: "mrkdwn", text: lines.join("\n") || "변경 없음" },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "어드민", emoji: true },
            url: `${ADMIN_BASE_URL}/admin`,
          },
        ],
      },
    ],
  };
}

/** 동기화 실패 → Slack Block Kit 메시지. */
export function buildSyncFailureSlackMessage(message: string): object {
  return {
    text: `🚨 경기 데이터 자동 동기화 실패: ${message}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🚨 경기 데이터 자동 동기화 실패",
          emoji: true,
        },
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: `*오류:*\n${message}` },
      },
    ],
  };
}
