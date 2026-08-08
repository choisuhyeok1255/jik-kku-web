-- live-activity-pusher cron을 요일·시간대 기준으로 제한한다(기존 24시간 매분 → 경기 시간대만).
-- 기준 시각은 KST이며, pg_cron은 UTC로 동작하므로 9시간 빼서 변환한다.
--
--   화~금: KST 18:00 ~ 익일 02:00  = UTC 09:00~16:59, 요일 2-5  → '* 9-16 * * 2-5'
--   토·일: KST 13:00 ~ 익일 02:00  = UTC 04:00~16:59, 요일 6,0  → '* 4-16 * * 6,0'
--
-- KST 게임일의 윈도우(시작 ~ 익일 새벽 2시)는 UTC 기준으로도 같은 날짜에 머물러 요일이 밀리지 않는다.
-- 월요일(KST/UTC 모두)은 KBO 경기가 없어 제외한다.
-- 익일 새벽 2시까지 여유를 두는 이유: 자정을 넘기는 연장 경기의 점수 갱신과,
-- 경기 종료 시 Live Activity를 내려주는 end 푸시(위젯 정리)가 누락되지 않게 하기 위함.
--
-- invoke 함수(private.invoke_live_activity_pusher)는 이전 마이그레이션에서 이미 정의됐으므로 그대로 재사용한다.

do $do$
declare
  jid bigint;
  job_name text;
begin
  if not exists (select 1 from pg_namespace where nspname = 'cron') then
    raise warning 'cron 스키마 없음 — pg_cron 미설치, 스케줄 변경 건너뜀';
    return;
  end if;

  -- 기존 24시간 잡과, 재실행 대비 신규 잡들을 모두 unschedule (idempotent)
  foreach job_name in array array[
    'live-activity-pusher-every-minute',
    'live-activity-pusher-weekday',
    'live-activity-pusher-weekend'
  ]
  loop
    select jobid into jid from cron.job where jobname = job_name;
    if jid is not null then
      perform cron.unschedule(jid);
    end if;
  end loop;
end;
$do$;

-- 화~금: KST 18:00 ~ 익일 02:00
select cron.schedule(
  'live-activity-pusher-weekday',
  '* 9-16 * * 2-5',
  $$ select private.invoke_live_activity_pusher(); $$
);

-- 토·일: KST 13:00 ~ 익일 02:00
select cron.schedule(
  'live-activity-pusher-weekend',
  '* 4-16 * * 6,0',
  $$ select private.invoke_live_activity_pusher(); $$
);
