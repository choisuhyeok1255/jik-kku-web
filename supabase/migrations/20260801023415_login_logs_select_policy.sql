-- upsert의 갱신(ON CONFLICT DO UPDATE)이 RLS에 막히는 것을 푼다.
--
-- Postgres는 INSERT ... ON CONFLICT DO UPDATE에 UPDATE 정책뿐 아니라 **SELECT 정책의 USING**도
-- 적용한다(충돌한 기존 행을 읽어야 갱신 대상을 정할 수 있기 때문). login_logs에는 insert/update
-- 정책만 있고 select 정책이 없어, 실제 사용자 권한에서 갱신 레그가 42501로 거부됐다.
--
--   ERROR: 42501 new row violates row-level security policy for table "login_logs"
--
-- 그 결과 "행이 없으면 추가"(INSERT 레그)만 통과하고 이번 변경의 목적인 "재접속 시 갱신"이
-- 전부 실패한다. 게다가 앱은 적재 실패를 삼키고 넘어가므로 겉으로는 정상처럼 보인다.
-- (service_role은 RLS를 우회하므로 대시보드에서 테스트하면 이 문제가 드러나지 않는다.)
--
-- 이 저장소에서 클라이언트가 upsert하는 다른 테이블(live_activities, push_to_start_tokens,
-- android_live_score_tokens 등)이 모두 select_own 정책을 함께 갖고 있는 것과 같은 이유다.
--
-- 조회 범위는 본인 행으로 한정한다. 대시보드 조회는 service_role이라 이 정책의 영향을 받지 않는다.

create policy "login_logs_select_own" on public.login_logs
  for select to authenticated
  using ((select auth.uid()) = user_id);
