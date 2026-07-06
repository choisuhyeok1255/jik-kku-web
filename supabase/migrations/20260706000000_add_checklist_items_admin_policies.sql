-- checklist_items(직관 준비물) 관리자 쓰기 RLS 정책
-- 어드민 추천 준비물 관리 페이지에서 관리자가 official 항목 추가/수정/삭제 및
-- unofficial → official 승격을 할 수 있도록 허용한다.
-- notices/inquiries와 동일한 하드코딩 관리자 UID 방식.
-- 기존 유저용 정책과 함께 OR로 평가되므로 유저 기능(본인 항목 추가 등)에는 영향 없음.

drop policy if exists "Admin can insert checklist_items" on public.checklist_items;
drop policy if exists "Admin can update checklist_items" on public.checklist_items;
drop policy if exists "Admin can delete checklist_items" on public.checklist_items;

-- 추가: official 항목 등록
create policy "Admin can insert checklist_items"
  on public.checklist_items for insert
  with check (auth.uid() = '3d6f7e16-c6bd-4a88-afe9-bf9fbbc8c004'::uuid);

-- 수정: label 변경 및 kind 변경(승격) 포함
create policy "Admin can update checklist_items"
  on public.checklist_items for update
  using (auth.uid() = '3d6f7e16-c6bd-4a88-afe9-bf9fbbc8c004'::uuid);

-- 삭제
create policy "Admin can delete checklist_items"
  on public.checklist_items for delete
  using (auth.uid() = '3d6f7e16-c6bd-4a88-afe9-bf9fbbc8c004'::uuid);
