-- =============================================================================
-- 경기 데이터 자동 동기화 크론 (Supabase pg_cron + pg_net)
-- =============================================================================
-- /api/cron/sync-games 를 호출한다. 엔드포인트는 (1) kbo-game 어제·오늘 경기를
-- game_records에 동기화(점수·상태)하고, (2) KBO 하이라이트 RSS로 비어있는 youtube_url을 채운다.
--
-- 스케줄 (pg_cron은 UTC 기준 / 괄호는 KST):
--   weekday-main : */15 11-15 * * 2-5  → 화~금 20:00~00:45 KST (15분 간격, 20회)
--   weekday-tail : 0 16 * * 2-5        → 화~금 01:00 KST 정각 (1회)  ... 합 21회/일
--   weekend-main : */15 7-14 * * 6,0   → 토·일 16:00~23:45 KST (15분 간격, 32회)
--   weekend-tail : 0 15 * * 6,0        → 토·일 00:00 KST 정각 (1회)  ... 합 33회/일
--   (월요일 제외 / 주 150회)
--
-- 실행 전 준비:
--   1) 아래 <CRON_SECRET> 을 Vercel 환경변수 CRON_SECRET 과 "같은 값"으로 치환할 것
--   2) URL의 도메인이 운영 도메인과 맞는지 확인 (기본: https://www.jik-kku.com)
--   3) Supabase 대시보드 SQL Editor에서 이 파일 전체를 실행
-- =============================================================================

-- 확장 활성화 (이미 켜져 있으면 무시됨)
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 재실행 대비: 기존 동일 이름 잡이 있으면 먼저 제거
select cron.unschedule('sync-games-weekday-main') where exists (select 1 from cron.job where jobname = 'sync-games-weekday-main');
select cron.unschedule('sync-games-weekday-tail') where exists (select 1 from cron.job where jobname = 'sync-games-weekday-tail');
select cron.unschedule('sync-games-weekend-main') where exists (select 1 from cron.job where jobname = 'sync-games-weekend-main');
select cron.unschedule('sync-games-weekend-tail') where exists (select 1 from cron.job where jobname = 'sync-games-weekend-tail');

-- 화~금 메인 (20:00~00:45 KST)
select cron.schedule(
  'sync-games-weekday-main',
  '*/15 11-15 * * 2-5',
  $$
  select net.http_post(
    url := 'https://www.jik-kku.com/api/cron/sync-games',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer <CRON_SECRET>"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- 화~금 정각 (01:00 KST)
select cron.schedule(
  'sync-games-weekday-tail',
  '0 16 * * 2-5',
  $$
  select net.http_post(
    url := 'https://www.jik-kku.com/api/cron/sync-games',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer <CRON_SECRET>"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- 토·일 메인 (16:00~23:45 KST)
select cron.schedule(
  'sync-games-weekend-main',
  '*/15 7-14 * * 6,0',
  $$
  select net.http_post(
    url := 'https://www.jik-kku.com/api/cron/sync-games',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer <CRON_SECRET>"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- 토·일 정각 (00:00 KST)
select cron.schedule(
  'sync-games-weekend-tail',
  '0 15 * * 6,0',
  $$
  select net.http_post(
    url := 'https://www.jik-kku.com/api/cron/sync-games',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer <CRON_SECRET>"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- 등록 확인
select jobname, schedule, active from cron.job where jobname like 'sync-games-%' order by jobname;
