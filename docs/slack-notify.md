# Slack 알림 (slack-notify Edge Function)

## 개요

DB 트리거로 호출되어, 주요 테이블에 INSERT가 발생하면 Slack Incoming Webhook으로 알림을 보내는 Edge Function이다.

- 진입점: `supabase/functions/slack-notify/index.ts` (Deno)
- 트리거: `users` / `game_logs` / `inquiries` 테이블 INSERT → 트리거 함수 `private.invoke_slack_notify()`가 호출
  - 정의: jik-kku 저장소 `supabase/migrations/20261111094351_slack_notify_webhooks_send_secret_header.sql`
  - 대시보드 Database → Webhooks 목록에는 보이지 않는다 (마이그레이션으로 관리)
- 배포: `supabase functions deploy slack-notify --no-verify-jwt --project-ref rfywltoeptuggsaabkxm` (코드 수정만으로는 반영되지 않으므로 재배포 필요)

## 인증 (공유 비밀 헤더)

게이트웨이 JWT 확인을 끄고(`--no-verify-jwt`) 대신 공유 비밀 헤더로 DB 트리거가 보낸 요청만 받는다. 함수 주소만 알면 누구나 관리자 Slack에 가짜 알림을 보낼 수 있던 구멍을 막기 위함이다.

- 헤더: `x-webhook-secret`
- 함수 쪽 값: Edge Function Secret `SLACK_NOTIFY_SECRET`
- 트리거 쪽 값: vault `slack_notify_secret` — `private.invoke_slack_notify()`가 읽어 헤더에 싣는다
- 두 값은 같아야 한다. 헤더가 없거나 다르면 401, `SLACK_NOTIFY_SECRET`이 비어 있으면 모든 요청을 401로 거절한다
- 값은 저장소·문서·트리거 정의 어디에도 적지 않는다. 대시보드 웹훅(`supabase_functions.http_request`)은 헤더를 트리거 정의에 글자 그대로 저장하므로 쓰지 않는다
- 두 값이 같은지는 해시로 확인한다: `supabase secrets list`의 `SLACK_NOTIFY_SECRET` 해시 = vault 값의 sha256

### 비밀 값 교체 순서 (알림이 끊기지 않게)

1. 새 값을 Edge Function Secret `SLACK_NOTIFY_SECRET`과 vault `slack_notify_secret`에 **둘 다** 반영한다 (vault는 `vault.update_secret`)
2. 위 해시 비교로 두 값이 같은지 확인한다
3. 한쪽만 바뀐 사이에는 알림이 401로 막히므로, 두 곳을 연달아 바꾼다

### 확인 방법 (Slack에 테스트 알림을 남기지 않음)

- 헤더 없이/틀린 값으로 POST → 401
- DB에서 vault 값을 실어 `type: "UPDATE"` 본문으로 `net.http_post` → `net._http_response`의 `status_code`가 200 (`INSERT`가 아니라 전송 안 함)

## 구조

- `index.ts` — 단일 파일. `Deno.serve` 핸들러가 webhook payload를 받아 `buildSlackMessage`로 메시지를 만들고 webhook URL로 POST한다.
- 주요 함수:
  - `buildSlackMessage(payload)` — `payload.table`에 따라 `users` / `game_logs` / `inquiries` 분기. `INSERT`가 아니면 `null` 반환(전송 안 함).
  - `fetchUserNickname(userId)` — `users` 테이블에서 닉네임 조회 (service role REST 호출).
  - `fetchMatchDateByGameRecordId(gameRecordId)` — `game_records` 테이블에서 `match_date` 조회.
  - `formatKstDate(iso)` — UTC ISO → KST `YYYY-MM-DD HH:mm:ss`.

## 동작 / 데이터 흐름

1. 트리거 함수가 대시보드 웹훅과 같은 `{ type, table, record, schema, old_record }` 형태로 POST (`x-webhook-secret` 헤더 포함, 제한 시간 5000ms).
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
- `SLACK_NOTIFY_SECRET` (필수) — 요청 확인용 공유 비밀. vault `slack_notify_secret`과 같은 값.

## 변경 이력

- 2026-11-11: 공유 비밀 헤더(`x-webhook-secret`) 확인 추가. 대시보드 웹훅 3개를 vault를 읽는 트리거 함수 `private.invoke_slack_notify()`로 교체.

- 2026-06-30: game_logs 알림에 경기일(`game_record_id` → `game_records.match_date` 조회) 추가, 어드민 버튼 제거.
