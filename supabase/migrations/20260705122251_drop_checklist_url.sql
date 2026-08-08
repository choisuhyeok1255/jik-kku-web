-- 직관 준비 체크리스트에서 미사용 url 컬럼 제거. 참조 없고 데이터도 없어 안전.
alter table public.checklist_items drop column url;
