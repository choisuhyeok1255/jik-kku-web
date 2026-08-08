-- 경기 id(game_records.id)를 바꿀 때 직관 기록이 따라오도록 한다.
-- id는 "연월일+홈+원정+순번" 구조인데 더블헤더 순번이 실제 경기 순서와 어긋나 있어,
-- 순번을 바로잡으려면 참조하는 game_logs가 함께 움직여야 한다.
-- 삭제는 기존대로 NO ACTION — 직관 기록이 달린 경기를 실수로 지우는 것은 계속 막는다.
alter table game_logs
  drop constraint game_logs_game_record_id_fkey;

alter table game_logs
  add constraint game_logs_game_record_id_fkey
  foreign key (game_record_id) references game_records(id)
  on update cascade;
