-- checklist_items 삭제 시 사용 중이면 차단 (CASCADE → RESTRICT)
-- 유저가 담고 있는(user_checklist_entries에 참조된) 항목은 삭제되지 않도록 막는다.
-- 기존에는 ON DELETE CASCADE라 삭제 시 유저 체크 기록까지 함께 지워졌음.

alter table public.user_checklist_entries
  drop constraint user_checklist_entries_item_id_fkey;

alter table public.user_checklist_entries
  add constraint user_checklist_entries_item_id_fkey
    foreign key (item_id) references public.checklist_items (id) on delete restrict;
