import { NextResponse } from "next/server";

import {
  buildSyncFailureSlackMessage,
  buildSyncSlackMessage,
  syncGameRecordsFromTheSportsDb,
} from "@/src/pages/admin/lib/gameRecordsSync.server";
import { sendSlackMessage } from "@/src/shared/lib/slack";

/**
 * 경기 데이터 자동 동기화 크론 엔드포인트.
 * - `Authorization: Bearer <CRON_SECRET>` 헤더로 보호한다 (pg_cron이 호출).
 * - TheSportsDB 어제·오늘 경기를 `game_records`에 동기화하고, 변경이 있으면 Slack으로 요약을,
 *   실패하면 Slack으로 실패 알림을 보낸다.
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
    const result = await syncGameRecordsFromTheSportsDb();

    if (webhookUrl && result.changed.length > 0) {
      await sendSlackMessage(webhookUrl, buildSyncSlackMessage(result));
    }

    return NextResponse.json({ ok: true, ...result });
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
