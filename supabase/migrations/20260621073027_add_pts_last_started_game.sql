alter table public.push_to_start_tokens
  add column last_started_game_id text;

comment on column public.push_to_start_tokens.last_started_game_id
  is 'push-to-start로 마지막에 시작 푸시를 보됌 TheSportsDB idEvent (중복 start 방지용)';
