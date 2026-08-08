-- 앱 로그인/접속 흐름 수집용 로그 테이블.
-- onAuthStateChange의 SIGNED_IN(신규·재로그인)·INITIAL_SESSION(세션 복원=앱 재접속)만 클라이언트가 적재한다.
-- TOKEN_REFRESHED(토큰 자동 갱신)는 노이즈라 적재하지 않는다.
-- 조회는 대시보드(service_role)에서 하며, 닉네임은 users 테이블 join으로 붙인다.

create table public.login_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade,
  event text not null,
  provider text,
  platform text,
  app_version text
);

comment on table public.login_logs is '앱 로그인/접속 로그 (SIGNED_IN=신규·재로그인, INITIAL_SESSION=세션 복원). 토큰 자동 갱신은 제외';
comment on column public.login_logs.event is 'SIGNED_IN | INITIAL_SESSION — 실제 로그인 / 세션 복원 구분';
comment on column public.login_logs.provider is 'kakao | apple 등 로그인 수단';

create index login_logs_created_at_idx on public.login_logs (created_at desc);
create index login_logs_user_id_idx on public.login_logs (user_id);

-- RLS: 클라이언트는 insert만 가능(읽기/수정/삭제 불가). 서버(service_role)만 조회.
-- 본인 uid만 적재 가능하게 제한해 타인 사칭 적재를 막는다.
alter table public.login_logs enable row level security;

create policy "login_logs_insert_own" on public.login_logs
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
