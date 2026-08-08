-- 공유·검토 개념 제거. 커스텀은 비공개, 어드민이 kind를 official로 승격.
drop policy "checklist_items_delete_own" on public.checklist_items;
create policy "checklist_items_delete_own" on public.checklist_items
  for delete to authenticated
  using (created_by = (select auth.uid()) and kind = 'unofficial');

alter table public.checklist_items drop column is_shared;
alter table public.checklist_items drop column review_status;

drop type public.checklist_review_status;
