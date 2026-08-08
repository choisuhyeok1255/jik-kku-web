-- 직관 준비 체크리스트에서 이모지 제거. 앱에서 더 이상 아이콘을 표시하지 않는다.
alter table public.checklist_items drop column emoji;
