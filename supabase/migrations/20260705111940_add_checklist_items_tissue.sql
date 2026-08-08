-- 직관 준비 체크리스트 공식 항목 추가: 휴지 / 물티슈 (기타 카테고리)
insert into public.checklist_items (label, normalized_label, emoji, category, kind, is_shared, review_status)
values
  ('휴지', '휴지', '🧻', 'etc', 'official', true, 'approved'),
  ('물티슈', '물티슈', '🧻', 'etc', 'official', true, 'approved');
