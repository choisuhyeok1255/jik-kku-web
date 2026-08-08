create table if not exists public.app_version_requirement (
  id smallint primary key default 1 check (id = 1),
  min_ios_version text,
  min_android_version text,
  ios_app_store_url text,
  android_play_store_url text,
  body_message text,
  updated_at timestamptz not null default now()
);

comment on table public.app_version_requirement is '앱 최소 버전·스토어 URL (단일 행 id=1). RLS로 anon 읽기 허용.';

insert into public.app_version_requirement (
  id,
  min_ios_version,
  min_android_version,
  ios_app_store_url,
  android_play_store_url,
  body_message
)
values (
  1,
  null,
  null,
  'https://apps.apple.com/app/id0000000000',
  'https://play.google.com/store/apps/details?id=com.jikkku.app',
  '보안과 서비스 개선을 위해 최신 버전으로 업데이트해 주세요.'
)
on conflict (id) do nothing;

alter table public.app_version_requirement enable row level security;

drop policy if exists "app_version_requirement_select_public" on public.app_version_requirement;

create policy "app_version_requirement_select_public"
  on public.app_version_requirement
  for select
  to anon, authenticated
  using (true);
