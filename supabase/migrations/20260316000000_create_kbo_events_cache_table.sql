-- KBO 경기 일정 캐시 테이블 (TheSportsDB/외부 API 호출 제한 회피용)
-- 한 행 = 경기 1건, id = idEvent
create table public.kbo_events_cache (
  id text primary key,
  date_event text not null,
  data jsonb not null
);

comment on table public.kbo_events_cache is 'KBO 경기 일정 캐시 (경기별)';

comment on column public.kbo_events_cache.id is '경기 ID (idEvent)';

comment on column public.kbo_events_cache.date_event is '경기 날짜 YYYY-MM-DD';

comment on column public.kbo_events_cache.data is '경기 상세 JSON (KboEventRow)';

create index idx_kbo_events_cache_date
  on public.kbo_events_cache (date_event);

alter table public.kbo_events_cache enable row level security;

create policy "Anyone can read kbo_events_cache"
  on public.kbo_events_cache for select
  using (true);

create policy "Anyone can insert kbo_events_cache"
  on public.kbo_events_cache for insert
  with check (true);

create policy "Anyone can update kbo_events_cache"
  on public.kbo_events_cache for update
  using (true);
