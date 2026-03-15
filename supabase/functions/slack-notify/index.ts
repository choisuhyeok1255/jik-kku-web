// Supabase Database Webhook → Slack 알림
// inquiries INSERT, users INSERT(회원가입), game_logs INSERT(경기 기록) 시 호출됨
declare const Deno: {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
  env: { get: (key: string) => string | undefined };
};

const ADMIN_BASE_URL = "https://www.jik-kku.com";

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: Record<string, unknown> | null;
  old_record: Record<string, unknown> | null;
}

interface InquiryRecord {
  id: number;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
}

interface UserRecord {
  id: string;
  nickname: string;
  created_at: string;
}

interface GameLogRecord {
  id: number;
  user_id: string;
  match_date: string;
  home_team_id: number;
  away_team_id: number;
  home_team_score: number;
  away_team_score: number;
  game_log_image: string | null;
  created_at: string;
}

function formatKstDate(isoDate: string): string {
  const date = new Date(isoDate);
  const kstTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${kstTime.getUTCFullYear()}-${String(kstTime.getUTCMonth() + 1).padStart(2, "0")}-${String(kstTime.getUTCDate()).padStart(2, "0")} ${String(kstTime.getUTCHours()).padStart(2, "0")}:${String(kstTime.getUTCMinutes()).padStart(2, "0")}`;
}

function buildSlackMessage(payload: WebhookPayload): object | null {
  if (payload.type !== "INSERT" || !payload.record) return null;

  if (payload.table === "users") {
    const record = payload.record as unknown as UserRecord;
    const formattedDate = formatKstDate(record.created_at);
    return {
      text: `👋 새 회원가입: ${record.nickname}`,
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: "👋 새 회원가입", emoji: true },
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*닉네임:*\n${record.nickname}` },
            { type: "mrkdwn", text: `*가입 시각:*\n${formattedDate}` },
          ],
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

  if (payload.table === "game_logs") {
    const record = payload.record as unknown as GameLogRecord;
    const formattedDate = formatKstDate(record.created_at);
    const scoreText = `${record.home_team_score} : ${record.away_team_score}`;
    const hasImage = !!record.game_log_image;
    return {
      text: `⚾ 새 경기 기록: ${record.match_date} (${scoreText})`,
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: "⚾ 새 경기 기록", emoji: true },
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*경기일:*\n${record.match_date}` },
            { type: "mrkdwn", text: `*스코어:*\n${scoreText}` },
            { type: "mrkdwn", text: `*등록 시각:*\n${formattedDate}` },
            {
              type: "mrkdwn",
              text: `*사진:*\n${hasImage ? "있음 (인증 대기)" : "없음"}`,
            },
          ],
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: "직관 인증", emoji: true },
              url: `${ADMIN_BASE_URL}/admin/certify`,
            },
          ],
        },
      ],
    };
  }

  if (payload.table !== "inquiries") return null;

  const record = payload.record as unknown as InquiryRecord;
  const formattedDate = formatKstDate(record.created_at);

  const contentPreview =
    record.content.length > 100
      ? `${record.content.slice(0, 100)}...`
      : record.content;

  return {
    text: `📩 새 1대1 문의: ${record.title}`,
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: "📩 새 1대1 문의", emoji: true },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*제목:*\n${record.title}` },
          {
            type: "mrkdwn",
            text: `*등록 시각:*\n${formattedDate}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*내용:*\n${contentPreview.replace(/\n/g, " ")}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "어드민에서 확인", emoji: true },
            url: `${ADMIN_BASE_URL}/admin/inquiries`,
          },
        ],
      },
    ],
  };
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const payload = (await req.json()) as WebhookPayload;
    const slackBody = buildSlackMessage(payload);

    if (!slackBody) {
      return new Response("OK", { status: 200 });
    }

    // 테이블별 webhook: 직관 생성, 회원가입은 별도 채널
    const webhookUrl =
      payload.table === "game_logs"
        ? Deno.env.get("SLACK_WEBHOOK_URL_GAME_LOGS") ??
          Deno.env.get("SLACK_WEBHOOK_URL")
        : payload.table === "users"
          ? Deno.env.get("SLACK_WEBHOOK_URL_USERS") ??
            Deno.env.get("SLACK_WEBHOOK_URL")
          : Deno.env.get("SLACK_WEBHOOK_URL");

    if (!webhookUrl) {
      console.error("SLACK_WEBHOOK_URL is not set");
      return new Response("Internal Server Error", { status: 500 });
    }

    const slackRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slackBody),
    });

    if (!slackRes.ok) {
      console.error("Slack webhook failed:", await slackRes.text());
      return new Response("Slack delivery failed", { status: 502 });
    }

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error("slack-notify error:", e);
    return new Response("Internal Server Error", { status: 500 });
  }
});
