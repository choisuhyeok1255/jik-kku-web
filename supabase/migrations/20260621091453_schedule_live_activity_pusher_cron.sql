-- pg_cron + pg_net으로 live-activity-pusher Edge Function을 1분마다 호출한다.
-- 앱이 꺼져 있어도 Live Activity 점수를 APNs update/start/end로 갱신하기 위함.
--
-- 사전 조건: Supabase Vault에 Edge Function PUSHER_SECRET과 동일한 값이 있어야 한다.
--   select vault.create_secret('<PUSHER_SECRET>', 'live_activity_pusher_secret', 'live-activity-pusher cron auth');

create extension if not exists pg_cron with schema pg_catalog;

create schema if not exists private;

-- cron 전용: vault 시크릿으로 Edge Function을 POST한다(security definer, API 노출 없음).
create or replace function private.invoke_live_activity_pusher()
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
    raise warning 'live_activity_pusher_secret vault 항목 없음 — cron 호출 건너뜀';
    return null;
  end if;

  select net.http_post(
    url := 'https://rfywltoeptuggsaabkxm.supabase.co/functions/v1/live-activity-pusher',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-pusher-secret', pusher_secret
    ),
    body := '{}'::jsonb
  ) into request_id;

  return request_id;
end;
$$;

revoke all on function private.invoke_live_activity_pusher() from public;
revoke all on function private.invoke_live_activity_pusher() from anon, authenticated;

do $do$
declare
  jid bigint;
begin
  if exists (select 1 from pg_namespace where nspname = 'cron') then
    select jobid into jid
    from cron.job
    where jobname = 'live-activity-pusher-every-minute';

    if jid is not null then
      perform cron.unschedule(jid);
    end if;
  end if;
end;
$do$;

select cron.schedule(
  'live-activity-pusher-every-minute',
  '* * * * *',
  $$ select private.invoke_live_activity_pusher(); $$
);
