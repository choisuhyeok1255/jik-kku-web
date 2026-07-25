/**
 * KBO 하이라이트 재생목록으로 `game_records.youtube_url` 자동 채우기 (server 전용).
 * - 재생목록 최근 영상 → 경기(날짜 + 두 팀 조합, 순서 무관) 매칭 → youtube_url이 비었으면 채운다.
 * - 이미 값이 있으면 보존(수동 입력 포함)하고, 더블헤더(매칭 2건+)는 건너뛰고 로그로 남긴다.
 * - 결과(채움/건너뜀/실패 수)는 크론의 Slack 요약에 합쳐 보고한다.
 */
import "server-only";

import type { TeamServerModel } from "@/src/entities/team/model/types/api";
import { createAdminClient } from "@/src/shared/lib/supabase/admin";
import type { Database } from "@/src/shared/lib/supabase.types";

import {
  fetchKboHighlightVideos,
  matchTeamIdByKoreanName,
  parseHighlightTitle,
} from "./kboHighlights";

type GameRecordMatchRow = Pick<
  Database["public"]["Tables"]["game_records"]["Row"],
  "id" | "match_date" | "home_team_id" | "away_team_id" | "youtube_url"
>;

/** youtube_url을 새로 채운 경기 1건. */
export type YoutubeFilledGame = {
  gameId: number;
  matchDate: string;
  matchup: string;
  youtubeUrl: string;
};

/** 더블헤더(같은 날·같은 팀 2건+)로 건너뛴 항목. */
export type YoutubeSkippedDoubleHeader = {
  matchDate: string;
  matchup: string;
  count: number;
};

/** 하이라이트 채우기 1회 결과. */
export type YoutubeFillResult = {
  /** 실행 시각 (ISO 8601 UTC) */
  ranAt: string;
  /** 재생목록에서 가져온 영상 수 */
  totalVideos: number;
  /** 새로 채운 경기 목록 */
  filled: YoutubeFilledGame[];
  /** 이미 youtube_url이 있어 보존한 수 */
  alreadyHad: number;
  /** 더블헤더로 건너뛴 목록 */
  skippedDoubleHeader: YoutubeSkippedDoubleHeader[];
  /** 제목 파싱 실패 수 */
  parseFailed: number;
  /** 팀명→team_id 매칭 실패 수 */
  teamMatchFailed: number;
  /** DB에 해당 경기가 없어 못 채운 수 */
  noGameMatch: number;
};

const isMissing = (url: string | null): boolean =>
  url == null || url.trim() === "";

/** 두 팀 id를 순서 무관 키로 (정렬 후 결합). */
const teamPairKey = (a: number, b: number): string =>
  [a, b].sort((x, y) => x - y).join("-");

/**
 * KBO 하이라이트 재생목록으로 비어있는 `youtube_url`을 채운다.
 * @throws 재생목록 조회 실패·DB 조회/업데이트 실패 시
 */
export async function fillYoutubeFromKboHighlights(): Promise<YoutubeFillResult> {
  const ranAt = new Date().toISOString();
  const admin = createAdminClient();

  const videos = await fetchKboHighlightVideos();
  const result: YoutubeFillResult = {
    ranAt,
    totalVideos: videos.length,
    filled: [],
    alreadyHad: 0,
    skippedDoubleHeader: [],
    parseFailed: 0,
    teamMatchFailed: 0,
    noGameMatch: 0,
  };
  if (videos.length === 0) return result;

  const { data: teamsData, error: teamsError } = await admin
    .from("teams")
    .select("*");
  if (teamsError) throw teamsError;
  const teams = (teamsData ?? []) as TeamServerModel[];
  const teamLabel = (id: number) =>
    teams.find((t) => t.id === id)?.short_team_name ?? `#${id}`;

  // 1) 영상 → (경기일, 팀 조합, 영상 URL) 후보 파싱
  type Candidate = {
    matchDate: string;
    idA: number;
    idB: number;
    videoUrl: string;
  };
  const candidates: Candidate[] = [];
  for (const video of videos) {
    const parsed = parseHighlightTitle(video.title, video.publishedAt);
    if (!parsed) {
      result.parseFailed += 1;
      continue;
    }
    const idA = matchTeamIdByKoreanName(teams, parsed.teamNames[0]);
    const idB = matchTeamIdByKoreanName(teams, parsed.teamNames[1]);
    if (idA == null || idB == null) {
      result.teamMatchFailed += 1;
      continue;
    }
    candidates.push({
      matchDate: parsed.matchDate,
      idA,
      idB,
      videoUrl: video.videoUrl,
    });
  }
  if (candidates.length === 0) return result;

  // 2) 영상들이 걸친 날짜 범위의 game_records를 한 번에 조회
  const dates = candidates.map((c) => c.matchDate).sort();
  const { data: gamesData, error: gamesError } = await admin
    .from("game_records")
    .select("id, match_date, home_team_id, away_team_id, youtube_url")
    .gte("match_date", dates[0]!)
    .lte("match_date", dates[dates.length - 1]!);
  if (gamesError) throw gamesError;
  const games = (gamesData ?? []) as GameRecordMatchRow[];

  // (경기일 : 팀 조합) → 경기 목록
  const gamesByKey = new Map<string, GameRecordMatchRow[]>();
  for (const game of games) {
    const key = `${game.match_date}:${teamPairKey(game.home_team_id, game.away_team_id)}`;
    const list = gamesByKey.get(key) ?? [];
    list.push(game);
    gamesByKey.set(key, list);
  }

  // 3) 후보별 매칭 → 채우기 대상 수집
  const updates: { id: number; youtubeUrl: string }[] = [];
  for (const candidate of candidates) {
    const key = `${candidate.matchDate}:${teamPairKey(candidate.idA, candidate.idB)}`;
    const matched = gamesByKey.get(key) ?? [];
    const matchup = `${teamLabel(candidate.idA)} vs ${teamLabel(candidate.idB)}`;

    if (matched.length === 0) {
      result.noGameMatch += 1;
      continue;
    }
    if (matched.length > 1) {
      result.skippedDoubleHeader.push({
        matchDate: candidate.matchDate,
        matchup,
        count: matched.length,
      });
      continue;
    }

    const game = matched[0]!;
    if (!isMissing(game.youtube_url)) {
      result.alreadyHad += 1;
      continue;
    }

    updates.push({ id: game.id, youtubeUrl: candidate.videoUrl });
    // 같은 경기를 다른 영상이 또 채우지 않도록 메모리 상에서 채운 것으로 표시
    game.youtube_url = candidate.videoUrl;
    result.filled.push({
      gameId: game.id,
      matchDate: candidate.matchDate,
      matchup,
      youtubeUrl: candidate.videoUrl,
    });
  }

  // 4) 비어있던 경기에 youtube_url 저장
  for (const update of updates) {
    const { error } = await admin
      .from("game_records")
      .update({ youtube_url: update.youtubeUrl })
      .eq("id", update.id);
    if (error) throw error;
  }

  return result;
}
