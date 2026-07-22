/**
 * KBO 공식 유튜브 "하이라이트" 재생목록 RSS 조회·파싱 (server 전용).
 * - YouTube Data API 키 없이 재생목록 RSS 피드(최근 ~15개)를 가져온다.
 * - 영상 제목(`[A vs B] M.D(요일) 야구 하이라이트…`)에서 경기일·두 팀명을 파싱한다.
 * - 재생목록 팀명 표기(공백 없음, 예: `SSG랜더스`)를 DB `teams`의 team_id로 매칭한다.
 */
import "server-only";

import type { TeamServerModel } from "@/src/entities/team/model/types/api";

/** 2026 시즌 KBO 리그 하이라이트 재생목록 ID (시즌마다 갱신 필요). */
const KBO_HIGHLIGHTS_PLAYLIST_ID = "PLuY-NTS_5Ipz7qggSm4O0aTp4RQjNCLCl";
const RSS_FEED_BASE = "https://www.youtube.com/feeds/videos.xml?playlist_id=";

/** RSS 피드에서 뽑은 영상 1건. */
export type KboHighlightVideo = {
  videoId: string;
  title: string;
  /** 게시일 (ISO 8601, 예: `2026-07-22T13:32:04+00:00`) */
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

const XML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
};

const decodeXml = (s: string): string =>
  s.replace(/&(amp|lt|gt|quot|#39|apos);/g, (m) => XML_ENTITIES[m] ?? m);

/**
 * KBO 하이라이트 재생목록 RSS를 가져와 영상 목록(최근 ~15개)으로 파싱한다.
 * @throws RSS 요청 실패(비 200) 시
 */
export async function fetchKboHighlightVideos(): Promise<KboHighlightVideo[]> {
  const url = `${RSS_FEED_BASE}${KBO_HIGHLIGHTS_PLAYLIST_ID}`;
  const response = await fetch(url, {
    headers: { Accept: "application/atom+xml" },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`KBO 하이라이트 RSS 요청 실패: HTTP ${response.status}`);
  }
  const xml = await response.text();

  const videos: KboHighlightVideo[] = [];
  const entries = xml.split("<entry>").slice(1);
  for (const entry of entries) {
    const videoId = entry
      .match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]
      ?.trim();
    const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const publishedAt = entry
      .match(/<published>([^<]+)<\/published>/)?.[1]
      ?.trim();
    if (!videoId || !title || !publishedAt) continue;

    videos.push({
      videoId,
      title: decodeXml(title).trim(),
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
