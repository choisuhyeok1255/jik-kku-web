-- login_logs의 스키마 설명을 실제 동작에 맞춘다.
--
-- 이 테이블의 소비자는 코드 밖 대시보드(service_role)라, DB 코멘트가 사실상의 스키마 문서다.
-- 앞선 마이그레이션의 코멘트가 아래 두 지점에서 실제와 어긋나 바로잡는다.
--
-- 1) event: 토큰 자동 갱신(TOKEN_REFRESHED)은 updated_at만 올리고 event는 건드리지 않도록 앱이
--    부분 update를 쓴다. 따라서 이 컬럼에 TOKEN_REFRESHED가 저장되는 일은 없는데, 코멘트는
--    가능한 값으로 열거하고 있어 "TOKEN_REFRESHED 건수 0"으로 오독될 수 있다.
-- 2) created_at: "최초 접속"이 아니다. 이 테이블은 2026-07-07에 생겼으므로 그 이전 가입자에게는
--    "로그 수집이 이 유저를 처음 관측한 시각"이다. 가입일은 auth.users.created_at을 봐야 한다.

comment on table public.login_logs is '유저당 1행. 마지막 접속 상태를 담는다. 앱이 user_id 기준 upsert(로그인) 또는 부분 update(토큰 자동 갱신)로 갱신한다';

comment on column public.login_logs.event is 'SIGNED_IN(재로그인) | INITIAL_SESSION(앱 재실행) — 마지막으로 로그인한 경로. 토큰 자동 갱신은 updated_at만 올리고 이 값은 바꾸지 않으므로 TOKEN_REFRESHED는 저장되지 않는다';

comment on column public.login_logs.created_at is '이 유저가 login_logs에 처음 기록된 시각(2026-07-07 수집 시작). 가입일이 아니다 — 가입일은 auth.users.created_at';

comment on column public.login_logs.provider is 'kakao | apple 등 마지막으로 로그인한 수단. event와 함께 갱신된다';
