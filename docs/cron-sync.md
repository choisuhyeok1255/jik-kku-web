# 경기 데이터 자동 동기화 (크론)

## 개요

정해진 시간마다 KBO 경기 결과를 `game_records`에 반영하고, 비어 있는 하이라이트 영상 주소를 채운다.

- 엔드포인트: `POST /api/cron/sync-games` (`app/api/cron/sync-games/route.ts`)
- 인증: `Authorization: Bearer <CRON_SECRET>` 헤더가 Vercel 환경 변수 `CRON_SECRET`과 같아야 한다. 다르면 401.
- 호출: Supabase pg_cron이 `net.http_post`로 호출한다.

## 동작

1. `kbo-game` 패키지(KBO 공식 사이트)로 어제와 오늘(KST) 경기를 가져와 `game_records`에 점수와 상태를 upsert한다.
2. KBO 하이라이트 재생목록(YouTube Data API)으로 비어 있는 `youtube_url`을 채운다. 이 단계가 실패해도 1단계 결과는 유지한다.
3. 변경이나 채운 항목이 있으면 Slack으로 요약을 보내고, 실패하면 실패 알림을 보낸다.

## 환경 변수 (Vercel)

| 이름 | 값 |
| --- | --- |
| `CRON_SECRET` | 크론 엔드포인트 보호 토큰. pg_cron SQL의 헤더 값과 같아야 한다 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase `service_role` 키 (서버 전용) |
| `SLACK_WEBHOOK_URL` | 동기화 요약과 실패 알림을 보낼 Slack Incoming Webhook URL |
| `YOUTUBE_API_KEY` | YouTube Data API v3 키 (하이라이트 채우기용, 서버 전용) |

## 스케줄 등록 (Supabase pg_cron)

스케줄과 등록 SQL은 [`supabase/cron/sync_game_records.sql`](../supabase/cron/sync_game_records.sql)이 단일 출처다. 시간대는 파일 맨 위 주석을 본다.

1. SQL Editor에서 파일 내용을 붙여넣는다.
2. `<CRON_SECRET>`을 실제 값으로 바꾼 뒤 실행한다.
3. **실제 값은 SQL Editor에서만 바꾼다. 저장소의 파일에는 `<CRON_SECRET>` 자리 표시를 그대로 둔다.**

현재 DB에 등록된 일정은 아래 쿼리로 확인한다.

```sql
select jobname, schedule from cron.job where jobname like 'sync-games%';
```
