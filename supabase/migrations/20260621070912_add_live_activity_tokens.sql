create extension if not exists moddatetime schema extensions;

create table public.live_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  push_token text not null unique,
  team_id integer references public.teams (id),
  game_id text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.live_activities is '시작된 KBO 라이브스코어 Live Activity의 APNs 갱신 토큰 (백그라운드 push update/end 대상)';
comment on column public.live_activities.push_token is 'ActivityKit 갱신용 push token (hex). expo-widgets activity.getPushToken()';
comment on column public.live_activities.game_id is 'TheSportsDB idEvent — 이 Activity가 보여주는 경기';
comment on column public.live_activities.status is 'active | ended';

create index live_activities_status_idx on public.live_activities (status);
create index live_activities_user_id_idx on public.live_activities (user_id);

create trigger live_activities_set_updated_at
  before update on public.live_activities
  for each row execute function extensions.moddatetime (updated_at);

create table public.push_to_start_tokens (
  token text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  team_id integer references public.teams (id),
  updated_at timestamptz not null default now()
);

comment on table public.push_to_start_tokens is 'KBO 라이브스코어 Live Activity push-to-start 토큰 (iOS 17.2+, 기기당 1개)';

create index push_to_start_tokens_user_id_idx on public.push_to_start_tokens (user_id);

create trigger push_to_start_tokens_set_updated_at
  before update on public.push_to_start_tokens
  for each row execute function extensions.moddatetime (updated_at);

alter table public.live_activities enable row level security;
alter table public.push_to_start_tokens enable row level security;

create policy "live_activities_select_own" on public.live_activities
  for select using ((select auth.uid()) = user_id);
create policy "live_activities_insert_own" on public.live_activities
  for insert with check ((select auth.uid()) = user_id);
create policy "live_activities_update_own" on public.live_activities
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "live_activities_delete_own" on public.live_activities
  for delete using ((select auth.uid()) = user_id);

create policy "push_to_start_tokens_select_own" on public.push_to_start_tokens
  for select using ((select auth.uid()) = user_id);
create policy "push_to_start_tokens_insert_own" on public.push_to_start_tokens
  for insert with check ((select auth.uid()) = user_id);
create policy "push_to_start_tokens_update_own" on public.push_to_start_tokens
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "push_to_start_tokens_delete_own" on public.push_to_start_tokens
  for delete using ((select auth.uid()) = user_id);
