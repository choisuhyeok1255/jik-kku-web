-- 앱 전역 에러/크래시 흐름 수집용 로그 테이블.
-- JS 전역 핸들러·ErrorBoundary·미처리 promise rejection에서 잡은 에러를 클라이언트가 직접 적재한다.
-- (네이티브 하드 크래시 스택은 Crashlytics가 담당하고, 이 테이블은 JS 에러 + 크래시 직전 흐름을 담는다.)
-- 크래시가 로그인 직전(세션 없음)에도 날 수 있어 user_id는 nullable, insert는 비로그인도 허용한다.

create table public.error_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users (id) on delete set null,
  platform text,
  app_version text,
  level text not null default 'error',
  source text,
  message text not null,
  stack text,
  context jsonb,
  breadcrumbs jsonb,
  fingerprint text
);

comment on table public.error_logs is '앱 전역 JS 에러/크래시 직전 흐름 로그 (네이티브 크래시는 Crashlytics가 담당)';
comment on column public.error_logs.source is 'js-global | promise-rejection | react-boundary | manual 등 에러 발생 지점';
comment on column public.error_logs.breadcrumbs is '크래시 직전 흐름(로그인/네비게이션 등) 발자취 배열';
comment on column public.error_logs.fingerprint is '동일 에러 중복 억제용 해시(메시지+스택 요약)';

create index error_logs_created_at_idx on public.error_logs (created_at desc);
create index error_logs_user_id_idx on public.error_logs (user_id);

-- RLS: 클라이언트는 insert만 가능(읽기/수정/삭제 불가). 서버(service_role)만 조회.
-- user_id는 null(비로그인)이거나 본인 uid만 허용해 타인 사칭 적재를 막는다.
alter table public.error_logs enable row level security;

create policy "error_logs_insert_any" on public.error_logs
  for insert to anon, authenticated
  with check (user_id is null or (select auth.uid()) = user_id);
