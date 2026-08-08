-- error_logs가 무한정 쌓이지 않도록 매일 30일 지난 행을 정리한다(로그 폭주/용량 방어).
-- 03:00 KST(UTC 18:00)에 실행. pg_cron은 live-activity-pusher 마이그레이션에서 이미 생성됨.

do $do$
declare
  jid bigint;
begin
  if exists (select 1 from pg_namespace where nspname = 'cron') then
    select jobid into jid from cron.job where jobname = 'cleanup-error-logs-daily';
    if jid is not null then
      perform cron.unschedule(jid);
    end if;
  end if;
end;
$do$;

select cron.schedule(
  'cleanup-error-logs-daily',
  '0 18 * * *',
  $$ delete from public.error_logs where created_at < now() - interval '30 days' $$
);
