-- 매일 03:00 KST(18:00 UTC)에 라이브스코어 카드/상태를 정리하는 cron.
-- KBO는 하루 1경기·새벽 경기 없음이라, 사용자가 안 지운 카드를 다음날 전에 초기화한다.
-- 실제 정리(iOS 카드 제거 + 서버 상태 초기화)는 Edge Function의 cleanup 모드가 수행한다.
-- 사전 조건: vault의 live_activity_pusher_secret (pusher cron 마이그레이션에서 이미 사용).

create or replace function private.invoke_live_activity_cleanup()
returns bigint
language plpgsql
security definer
set search_path = public, extensions, vault, net, pg_temp
as $$
declare
  request_id bigint;
  pusher_secret text;
begin
  select decrypted_secret into pusher_secret
  from vault.decrypted_secrets
  where name = 'live_activity_pusher_secret'
  limit 1;

  if pusher_secret is null or pusher_secret = '' then
    raise warning 'live_activity_pusher_secret vault 항목 없음 — cleanup 건너뜀';
    return null;
  end if;

  select net.http_post(
    url := 'https://rfywltoeptuggsaabkxm.supabase.co/functions/v1/live-activity-pusher',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-pusher-secret', pusher_secret
    ),
    body := '{"mode":"cleanup"}'::jsonb
  ) into request_id;

  return request_id;
end;
$$;

revoke all on function private.invoke_live_activity_cleanup() from public;
revoke all on function private.invoke_live_activity_cleanup() from anon, authenticated;

do $do$
declare
  jid bigint;
begin
  if exists (select 1 from pg_namespace where nspname = 'cron') then
    select jobid into jid from cron.job where jobname = 'live-activity-cleanup-3am-kst';
    if jid is not null then
      perform cron.unschedule(jid);
    end if;
  end if;
end;
$do$;

select cron.schedule(
  'live-activity-cleanup-3am-kst',
  '0 18 * * *',
  $$ select private.invoke_live_activity_cleanup(); $$
);
