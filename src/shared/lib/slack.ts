/**
 * Slack Incoming Webhook 전송 유틸.
 * - Block Kit 메시지(JSON)를 지정한 webhook URL로 POST한다.
 * - 도메인 무관 범용이라 `shared/lib`에 둔다.
 */

/**
 * Slack Incoming Webhook으로 메시지를 전송한다.
 * @param webhookUrl Slack Incoming Webhook URL
 * @param body Slack 메시지 본문(`text`/`blocks` 등)
 */
export async function sendSlackMessage(
  webhookUrl: string,
  body: object,
): Promise<void> {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Slack 전송 실패: HTTP ${response.status} ${text}`.trim());
  }
}
