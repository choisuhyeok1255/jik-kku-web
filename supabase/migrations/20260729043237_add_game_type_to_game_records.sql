-- 경기 종류 구분(시범경기/정규시즌/포스트시즌).
-- 네이버 일정 API는 이 셋을 구분해 주지 않아(응답 형태가 완전히 동일) 날짜로만 가를 수 있다.
-- 그래서 판정 결과를 컬럼에 박아 두고, 앞으로는 어드민이 넣을 때 채운다.
alter table game_records
  add column game_type text not null default 'regular';

comment on column game_records.game_type is
  'preseason=시범경기, regular=정규시즌, postseason=포스트시즌(와일드카드~한국시리즈)';

alter table game_records
  add constraint game_records_game_type_check
  check (game_type in ('preseason', 'regular', 'postseason'));

-- 시즌 경계 (KBO 실제 일정 기준)
--   2023: 정규 04-01~, 포스트 10-19~
--   2024: 정규 03-23~, 포스트 10-02~
--   2025: 정규 03-22~, 포스트 10-06~
--   2026: 정규 03-28~, 포스트 미정
update game_records
set game_type = case
  when match_date >= '2023-10-19' and match_date < '2024-01-01' then 'postseason'
  when match_date >= '2024-10-02' and match_date < '2025-01-01' then 'postseason'
  when match_date >= '2025-10-06' and match_date < '2026-01-01' then 'postseason'
  when match_date <  '2023-04-01' then 'preseason'
  when match_date >= '2024-01-01' and match_date < '2024-03-23' then 'preseason'
  when match_date >= '2025-01-01' and match_date < '2025-03-22' then 'preseason'
  when match_date >= '2026-01-01' and match_date < '2026-03-28' then 'preseason'
  else 'regular'
end;
