-- login_logs를 "로그인마다 한 줄씩 쌓는 이력"에서 "유저당 한 줄 유지 + 최신 접속으로 갱신"으로 바꾼다.
--
-- 왜: 필요한 지표가 "몇 번 접속했나"가 아니라 "이 사용자가 마지막으로 언제 들어왔나"라서,
-- 행이 무한히 쌓이는 대신 유저당 한 줄만 두고 갱신한다.
--
-- 갱신 시점은 앱이 SIGNED_IN(재로그인) · INITIAL_SESSION(앱 재실행) · TOKEN_REFRESHED(토큰 자동 갱신)를
-- 받을 때다. created_at은 최초 기록 시각으로 고정되고, updated_at이 마지막 접속 시각을 가리킨다.

-- 1) 마지막 접속 시각. 기존 행은 최초 기록 시각으로 채워 넣는다(그때가 마지막 접속이었으므로).
alter table public.login_logs
  add column updated_at timestamptz not null default now();

update public.login_logs set updated_at = created_at;

-- 2) upsert가 충돌을 판별할 기준. 유저당 한 줄만 존재하게 만든다.
--    (적용 시점 기준으로 user_id 중복 행이 없어 제약 추가가 실패하지 않는다)
alter table public.login_logs
  add constraint login_logs_user_id_key unique (user_id);

-- 위 unique 제약이 인덱스를 자동 생성하므로 기존 non-unique 인덱스는 완전히 중복이 된다.
drop index if exists public.login_logs_user_id_idx;

-- 3) 갱신 시각은 서버 시계로 찍는다. 클라이언트가 보낸 값을 믿으면 기기 시계 오차·조작이 그대로 들어온다.
create or replace function public.set_login_logs_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  -- 최초 기록 시각은 갱신 대상이 아니므로 덮어쓰기를 막는다.
  new.created_at = old.created_at;
  return new;
end;
$$;

create trigger login_logs_set_updated_at
  before update on public.login_logs
  for each row
  execute function public.set_login_logs_updated_at();

-- 4) upsert는 충돌 시 update로 이어지므로 insert 정책만으로는 막힌다. 본인 행에 한해 update를 허용한다.
create policy "login_logs_update_own" on public.login_logs
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

comment on table public.login_logs is '유저당 1행. 마지막 접속 상태를 담는다(updated_at=마지막 접속, created_at=최초 접속). 앱이 user_id 기준 upsert로 갱신한다';
comment on column public.login_logs.event is 'SIGNED_IN(재로그인) | INITIAL_SESSION(앱 재실행) | TOKEN_REFRESHED(토큰 자동 갱신) — 마지막 갱신을 유발한 이벤트';
comment on column public.login_logs.updated_at is '마지막 접속 시각. 트리거가 서버 시계로 갱신한다';
