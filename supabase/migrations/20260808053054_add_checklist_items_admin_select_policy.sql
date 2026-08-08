-- checklist_items 관리자 조회(SELECT) RLS 정책
-- 기존 유저 조회 정책은 "official 이거나 내가 만든 것"이라, 관리자도 다른 유저가 만든
-- unofficial 항목을 조회하지 못해 어드민 추천 준비물 관리 페이지에서 유저 항목이 보이지 않았다.
-- (목록에 뜨지 않으니 "승격" 기능 자체를 쓸 수 없었음)
-- 정책은 OR로 평가되므로 기존 유저 조회 범위는 그대로 유지된다.
-- 관리자 판별은 notices/inquiries와 동일한 하드코딩 UID 방식.
-- auth.uid()는 (select ...)로 감싸 쿼리당 1회만 평가되게 한다
-- (같은 테이블의 checklist_items_select 정책과 동일한 방식. 행마다 재평가 방지)

drop policy if exists "Admin can select checklist_items" on public.checklist_items;

create policy "Admin can select checklist_items"
  on public.checklist_items for select
  using ((select auth.uid()) = '3d6f7e16-c6bd-4a88-afe9-bf9fbbc8c004'::uuid);
