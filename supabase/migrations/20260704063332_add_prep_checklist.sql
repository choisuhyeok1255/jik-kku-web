-- 직관 준비 체크리스트
create type public.checklist_item_kind as enum ('official', 'unofficial');
create type public.checklist_review_status as enum ('none', 'pending', 'approved', 'rejected');
create type public.checklist_category as enum ('essential', 'weather', 'cheer', 'food', 'etc');

create table public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  normalized_label text not null,
  emoji text,
  url text,
  category public.checklist_category,
  kind public.checklist_item_kind not null default 'unofficial',
  is_shared boolean not null default false,
  review_status public.checklist_review_status not null default 'none',
  usage_count integer not null default 0,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

comment on table public.checklist_items is '직관 준비 체크리스트 항목 카탈로그 (공식/비공식)';
comment on column public.checklist_items.normalized_label is '검색·중복판정용 정규화 문구(공백 제거·소문자)';
comment on column public.checklist_items.category is '고르기 화면 카테고리별 브라우징용(공식). 체크리스트 화면은 flat';
comment on column public.checklist_items.is_shared is '비공식 공유 여부(혼자만=false). 공유하면 검토(pending) 대상';
comment on column public.checklist_items.usage_count is '이 항목을 담은 유저 수("N명 사용중"). 트리거로 유지';

create unique index checklist_items_official_norm_uidx
  on public.checklist_items (normalized_label) where kind = 'official';
create index checklist_items_picker_idx
  on public.checklist_items (kind, usage_count desc, label);
create index checklist_items_created_by_idx
  on public.checklist_items (created_by);

create table public.user_checklist_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  item_id uuid not null references public.checklist_items (id) on delete cascade,
  is_checked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, item_id)
);

comment on table public.user_checklist_entries is '유저가 담은 체크리스트 항목 + 개인 체크 상태';

create index user_checklist_entries_item_idx on public.user_checklist_entries (item_id);
create index user_checklist_entries_user_idx on public.user_checklist_entries (user_id);

create function public.bump_checklist_usage() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  if (tg_op = 'INSERT') then
    update public.checklist_items set usage_count = usage_count + 1 where id = new.item_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.checklist_items set usage_count = greatest(usage_count - 1, 0) where id = old.item_id;
    return old;
  end if;
  return null;
end;
$$;

create trigger user_checklist_entries_usage_aid
  after insert or delete on public.user_checklist_entries
  for each row execute function public.bump_checklist_usage();

alter table public.checklist_items enable row level security;
alter table public.user_checklist_entries enable row level security;

create policy "checklist_items_select" on public.checklist_items
  for select to authenticated
  using (kind = 'official' or created_by = (select auth.uid()));

create policy "checklist_items_insert_own" on public.checklist_items
  for insert to authenticated
  with check (created_by = (select auth.uid()) and kind = 'unofficial');

create policy "checklist_items_update_own" on public.checklist_items
  for update to authenticated
  using (created_by = (select auth.uid()) and kind = 'unofficial')
  with check (created_by = (select auth.uid()) and kind = 'unofficial');

create policy "checklist_items_delete_own" on public.checklist_items
  for delete to authenticated
  using (created_by = (select auth.uid()) and kind = 'unofficial' and is_shared = false);

create policy "user_checklist_entries_select_own" on public.user_checklist_entries
  for select to authenticated using (user_id = (select auth.uid()));
create policy "user_checklist_entries_insert_own" on public.user_checklist_entries
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "user_checklist_entries_update_own" on public.user_checklist_entries
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "user_checklist_entries_delete_own" on public.user_checklist_entries
  for delete to authenticated using (user_id = (select auth.uid()));

insert into public.checklist_items (label, normalized_label, emoji, category, kind, is_shared, review_status) values
  ('모바일 입장권 / 티켓', '모바일입장권/티켓', '🎟️', 'essential', 'official', true, 'approved'),
  ('현금 · 카드', '현금·카드', '💳', 'essential', 'official', true, 'approved'),
  ('신분증', '신분증', '🪪', 'essential', 'official', true, 'approved'),
  ('보조배터리', '보조배터리', '🔋', 'essential', 'official', true, 'approved'),
  ('우비 · 우산', '우비·우산', '☔', 'weather', 'official', true, 'approved'),
  ('선크림 · 모자', '선크림·모자', '🧴', 'weather', 'official', true, 'approved'),
  ('방석', '방석', '🪑', 'weather', 'official', true, 'approved'),
  ('담요', '담요', '🧣', 'weather', 'official', true, 'approved'),
  ('유니폼 · 응원 티셔츠', '유니폼·응원티셔츠', '👕', 'cheer', 'official', true, 'approved'),
  ('응원도구', '응원도구', '📣', 'cheer', 'official', true, 'approved'),
  ('먹거리 · 간식', '먹거리·간식', '🍗', 'food', 'official', true, 'approved'),
  ('물 · 음료', '물·음료', '💧', 'food', 'official', true, 'approved');
