// Supabase Database Webhook → Slack 알림
// inquiries INSERT 시 호출됨
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

function buildSlackMessage(payload: WebhookPayload): object | null {
  if (payload.type !== "INSERT" || !payload.record) return null;
  if (payload.table !== "inquiries") return null;

  const record = payload.record as unknown as InquiryRecord;
  const createdAt = new Date(record.created_at);
  const formattedDate = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}-${String(createdAt.getDate()).padStart(2, "0")} ${String(createdAt.getHours()).padStart(2, "0")}:${String(createdAt.getMinutes()).padStart(2, "0")}`;

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

  const webhookUrl = Deno.env.get("SLACK_WEBHOOK_URL");
  if (!webhookUrl) {
    console.error("SLACK_WEBHOOK_URL is not set");
    return new Response("Internal Server Error", { status: 500 });
  }

  try {
    const payload = (await req.json()) as WebhookPayload;
    const slackBody = buildSlackMessage(payload);

    if (!slackBody) {
      return new Response("OK", { status: 200 });
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
