/**
 * KBO 공식 유튜브 "하이라이트" 재생목록 조회·파싱 (server 전용).
 * - YouTube Data API v3 `playlistItems.list`로 최근 영상(최신순 최대 50개)을 가져온다.
 * - 영상 제목(`[A vs B] M.D(요일) 야구 하이라이트…`)에서 경기일·두 팀명을 파싱한다.
 * - 재생목록 팀명 표기(공백 없음, 예: `SSG랜더스`)를 DB `teams`의 team_id로 매칭한다.
 */
import "server-only";

import type { TeamServerModel } from "@/src/entities/team/model/types/api";

/** 2026 시즌 KBO 리그 하이라이트 재생목록 ID (시즌마다 갱신 필요). */
const KBO_HIGHLIGHTS_PLAYLIST_ID = "PLuY-NTS_5Ipz7qggSm4O0aTp4RQjNCLCl";
const PLAYLIST_ITEMS_ENDPOINT =
  "https://www.googleapis.com/youtube/v3/playlistItems";
/** 한 번에 가져올 영상 수 (API 상한 50). 재생목록은 최신이 앞이라 1페이지면 충분하다. */
const MAX_RESULTS = 50;

/** 재생목록에서 뽑은 영상 1건. */
export type KboHighlightVideo = {
  videoId: string;
  title: string;
  /** 영상 게시일 (ISO 8601, 예: `2026-07-24T13:32:04Z`) */
  publishedAt: string;
  /** `https://www.youtube.com/watch?v=<videoId>` */
  videoUrl: string;
};

/** 영상 제목 파싱 결과. */
export type ParsedHighlightTitle = {
  /** 경기일 `YYYY-MM-DD` (제목의 M.D + 게시연도) */
  matchDate: string;
  /** 제목에 적힌 두 팀명 (홈/원정 순서 불명 — 조합으로만 사용) */
  teamNames: [string, string];
};

type PlaylistItemsResponse = {
  items?: {
    snippet?: { title?: string };
    contentDetails?: { videoId?: string; videoPublishedAt?: string };
  }[];
};

/**
 * 실패 응답에서 사람이 읽을 오류 메시지만 뽑는다.
 * 본문 전체를 그대로 노출하지 않아 로그가 불필요하게 길어지지 않게 한다.
 * @returns 메시지를 못 읽으면 빈 문자열
 */
async function readApiErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: { message?: string } };
    return body.error?.message ?? "";
  } catch {
    return "";
  }
}

/**
 * KBO 하이라이트 재생목록을 조회해 영상 목록(최신순 최대 50개)으로 파싱한다.
 * @throws `YOUTUBE_API_KEY` 미설정 시, API 응답이 비 200일 때
 */
export async function fetchKboHighlightVideos(): Promise<KboHighlightVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY가 설정되지 않았습니다.");
  }

  const url = new URL(PLAYLIST_ITEMS_ENDPOINT);
  url.searchParams.set("part", "snippet,contentDetails");
  url.searchParams.set("playlistId", KBO_HIGHLIGHTS_PLAYLIST_ID);
  url.searchParams.set("maxResults", String(MAX_RESULTS));
  url.searchParams.set("key", apiKey);

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    const detail = await readApiErrorMessage(response);
    throw new Error(
      `KBO 하이라이트 조회 실패: HTTP ${response.status}${detail ? ` — ${detail}` : ""}`,
    );
  }

  const body = (await response.json()) as PlaylistItemsResponse;

  const videos: KboHighlightVideo[] = [];
  for (const item of body.items ?? []) {
    const videoId = item.contentDetails?.videoId;
    const title = item.snippet?.title;
    // 비공개·삭제된 영상은 videoPublishedAt이 없다 → 경기일 연도를 못 정하므로 건너뛴다.
    const publishedAt = item.contentDetails?.videoPublishedAt;
    if (!videoId || !title || !publishedAt) continue;

    videos.push({
      videoId,
      title: title.trim(),
      publishedAt,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
    });
  }
  return videos;
}

/**
 * 하이라이트 영상 제목에서 경기일·두 팀명을 파싱한다.
 * 형식: `[A vs B] M.D(요일) 야구 하이라이트…` (연도는 게시일에서 취함)
 * @returns 형식이 안 맞으면 `null`
 */
export function parseHighlightTitle(
  title: string,
  publishedAt: string,
): ParsedHighlightTitle | null {
  const matched = title.match(
    /\[([^\]]+?)\s*vs\s*([^\]]+?)\]\s*(\d{1,2})\.(\d{1,2})/,
  );
  if (!matched) return null;

  const [, teamA, teamB, month, day] = matched;
  const year = publishedAt.slice(0, 4);
  if (!/^\d{4}$/.test(year)) return null;

  const matchDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  return { matchDate, teamNames: [teamA.trim(), teamB.trim()] };
}

/** 팀명 비교용 정규화 — 공백 제거 + 소문자. */
const normalizeTeamName = (value: string | null): string =>
  (value ?? "").replace(/\s+/g, "").toLowerCase();

/**
 * 재생목록 표기 팀명(예: `SSG랜더스`)을 team_id로 매칭한다.
 * DB `team_name`은 공백 포함(`SSG 랜더스`)이라 공백 정규화 후 비교하고,
 * 약칭(`SSG`)이 앞에 오는지(prefix)도 함께 본다.
 * @returns 매칭 실패 시 `null`
 */
export function matchTeamIdByKoreanName(
  teams: TeamServerModel[],
  name: string,
): number | null {
  const normalized = normalizeTeamName(name);
  if (!normalized) return null;

  for (const team of teams) {
    if (normalizeTeamName(team.team_name) === normalized) return team.id;
    const short = normalizeTeamName(team.short_team_name);
    if (short && normalized.startsWith(short)) return team.id;
  }
  return null;
}
