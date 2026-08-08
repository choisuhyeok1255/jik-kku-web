-- 직관 준비 체크리스트 공식 항목에서 '담요' 제거. 담긴 엔트리 0건이라 유저 데이터 영향 없음.
delete from public.checklist_items
where kind = 'official' and normalized_label = '담요';
