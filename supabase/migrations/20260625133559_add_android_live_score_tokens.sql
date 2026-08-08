create table public.android_live_score_tokens (
  token text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  team_id integer references public.teams (id),
  last_started_game_id text,
  updated_at timestamptz not null default now()
);

comment on table public.android_live_score_tokens is 'KBO 라이브스코어 진행 알림 FCM 토큰 (안드로이드, 기기당 1개)';
comment on column public.android_live_score_tokens.last_started_game_id is 'TheSportsDB idEvent — 이 토큰으로 마지막 start 알림을 보낸 경기 (중복 시작 방지)';

create index android_live_score_tokens_user_id_idx on public.android_live_score_tokens (user_id);

create trigger android_live_score_tokens_set_updated_at
  before update on public.android_live_score_tokens
  for each row execute function extensions.moddatetime (updated_at);

alter table public.android_live_score_tokens enable row level security;

create policy "android_live_score_tokens_select_own" on public.android_live_score_tokens
  for select using ((select auth.uid()) = user_id);
create policy "android_live_score_tokens_insert_own" on public.android_live_score_tokens
  for insert with check ((select auth.uid()) = user_id);
create policy "android_live_score_tokens_update_own" on public.android_live_score_tokens
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "android_live_score_tokens_delete_own" on public.android_live_score_tokens
  for delete using ((select auth.uid()) = user_id);
