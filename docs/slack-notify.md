# Slack 알림 (slack-notify Edge Function)

## 개요

Supabase Database Webhook으로 트리거되어, 주요 테이블에 INSERT가 발생하면 Slack Incoming Webhook으로 알림을 보내는 Edge Function이다.

- 진입점: `supabase/functions/slack-notify/index.ts` (Deno)
- 트리거: `users` / `game_logs` / `inquiries` 테이블 INSERT (Supabase Dashboard → Database → Webhooks)
- 배포: `supabase functions deploy slack-notify --no-verify-jwt` (코드 수정만으로는 반영되지 않으므로 재배포 필요)

## 구조

- `index.ts` — 단일 파일. `Deno.serve` 핸들러가 webhook payload를 받아 `buildSlackMessage`로 메시지를 만들고 webhook URL로 POST한다.
- 주요 함수:
  - `buildSlackMessage(payload)` — `payload.table`에 따라 `users` / `game_logs` / `inquiries` 분기. `INSERT`가 아니면 `null` 반환(전송 안 함).
  - `fetchUserNickname(userId)` — `users` 테이블에서 닉네임 조회 (service role REST 호출).
  - `fetchMatchDateByGameRecordId(gameRecordId)` — `game_records` 테이블에서 `match_date` 조회.
  - `formatKstDate(iso)` — UTC ISO → KST `YYYY-MM-DD HH:mm:ss`.

## 동작 / 데이터 흐름

1. DB Webhook이 `{ type, table, record, schema, old_record }` 형태로 POST.
2. `type !== "INSERT"`거나 `record`가 없으면 종료.
3. 테이블별 메시지 구성:
   - **users**: "👋 새 회원가입" — 닉네임, 가입 시각. (어드민 버튼 있음)
   - **game_logs**: "⚾ 새 경기 기록" — 닉네임, **경기일**, 등록 시각, 사진 유무, 비공개 여부, 메모.
   - **inquiries**: "📩 새 1대1 문의" — 제목, 닉네임, 등록 시각, 내용 미리보기. (어드민 버튼 있음)
4. webhook URL 결정: `game_logs`는 `SLACK_WEBHOOK_URL_GAME_LOGS`, `users`는 `SLACK_WEBHOOK_URL_USERS`, 없으면 `SLACK_WEBHOOK_URL`로 폴백.

### game_logs 경기일 처리 (중요)

`game_logs` 테이블에는 경기 날짜 컬럼이 없고 `game_record_id`로 `game_records`를 참조한다. 따라서 경기일은 webhook payload에서 직접 못 읽고, `record.game_record_id` → `fetchMatchDateByGameRecordId`로 `game_records.match_date`를 조회해 표시한다. `game_record_id`가 없으면 "미상"으로 표시한다.

### 환경변수 (Edge Function Secrets)

- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — Supabase가 기본 주입. REST 조회(닉네임·경기일)에 사용.
- `SLACK_WEBHOOK_URL` (필수), `SLACK_WEBHOOK_URL_GAME_LOGS` / `SLACK_WEBHOOK_URL_USERS` (선택).

## 변경 이력

- 2026-06-30: game_logs 알림에 경기일(`game_record_id` → `game_records.match_date` 조회) 추가, 어드민 버튼 제거.
