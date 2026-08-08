-- 라이브스코어 데이터 소스 폴백 상태 (단일 행).
-- Edge Function(live-activity-pusher)은 호출마다 새로 실행되어 메모리에 상태를 남길 수 없으므로,
-- "네이버 연속 실패 횟수"를 이 테이블에 저장해 임계(2회) 도달 시 TheSportsDB로 폴백한다.
-- 네이버 성공 시 0으로 리셋된다(자동 복구).
create table public.live_score_source_state (
  id integer primary key check (id = 1),
  consecutive_naver_failures integer not null default 0,
  updated_at timestamptz not null default now()
);

-- 서비스 롤(Edge Function)만 접근 — 클라이언트용 정책은 두지 않는다
alter table public.live_score_source_state enable row level security;

insert into public.live_score_source_state (id) values (1);
