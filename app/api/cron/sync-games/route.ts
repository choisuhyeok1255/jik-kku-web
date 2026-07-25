import { NextResponse } from "next/server";

import {
  buildSyncFailureSlackMessage,
  buildSyncSlackMessage,
  syncGameRecordsFromKboGame,
} from "@/src/pages/admin/lib/gameRecordsSync.server";
import {
  fillYoutubeFromKboHighlights,
  type YoutubeFillResult,
} from "@/src/pages/admin/lib/youtubeHighlightSync.server";
import { sendSlackMessage } from "@/src/shared/lib/slack";

/**
 * 경기 데이터 자동 동기화 크론 엔드포인트.
 * - `Authorization: Bearer <CRON_SECRET>` 헤더로 보호한다 (pg_cron이 호출).
 * - kbo-game 어제·오늘 경기를 `game_records`에 동기화(점수·상태)하고, 이어서 KBO 하이라이트
 *   재생목록으로 비어있는 youtube_url을 채운다. 변경/채움이 있으면 Slack 요약을, 실패하면 실패 알림을 보낸다.
 * - 하이라이트 채우기 실패는 점수·상태 동기화를 막지 않는다(로그만 남기고 진행).
 */

export const dynamic = "force-dynamic";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

async function handleSyncRequest(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  try {
    const result = await syncGameRecordsFromKboGame();

    // 하이라이트 채우기 실패는 점수·상태 동기화를 막지 않는다 (로그만).
    let youtube: YoutubeFillResult | null = null;
    try {
      youtube = await fillYoutubeFromKboHighlights();
    } catch (youtubeError) {
      console.error("KBO 하이라이트 채우기 실패:", youtubeError);
    }

    const filledCount = youtube?.filled.length ?? 0;
    const skippedDhCount = youtube?.skippedDoubleHeader.length ?? 0;
    const shouldNotify =
      result.changed.length > 0 ||
      filledCount > 0 ||
      skippedDhCount > 0 ||
      youtube === null;

    if (webhookUrl && shouldNotify) {
      await sendSlackMessage(webhookUrl, buildSyncSlackMessage(result, youtube));
    }

    return NextResponse.json({ ok: true, sync: result, youtube });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (webhookUrl) {
      try {
        await sendSlackMessage(webhookUrl, buildSyncFailureSlackMessage(message));
      } catch {
        // Slack 전송 실패는 무시 (원본 오류 보고가 우선)
      }
    }

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return handleSyncRequest(request);
}

export async function GET(request: Request) {
  return handleSyncRequest(request);
}
