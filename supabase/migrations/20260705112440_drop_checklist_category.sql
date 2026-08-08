-- 직관 준비 체크리스트에서 카테고리 개념 제거. enum은 이 컬럼에서만 쓰여 함께 drop.
alter table public.checklist_items drop column category;
drop type public.checklist_category;
