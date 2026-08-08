-- 직관 준비 체크리스트 공식 항목 정리
-- 삭제 4개, 수정 2개, 분리 2개. 실행 시점 담긴 엔트리 0건이라 유저 데이터 영향 없음.

delete from public.checklist_items
where kind = 'official'
  and normalized_label in ('먹거리·간식', '물·음료', '신분증', '현금·카드');

update public.checklist_items
set label = '티켓', normalized_label = '티켓'
where kind = 'official' and normalized_label = '모바일입장권/티켓';

update public.checklist_items
set label = '유니폼', normalized_label = '유니폼'
where kind = 'official' and normalized_label = '유니폼·응원티셔츠';

update public.checklist_items
set label = '선크림', normalized_label = '선크림', emoji = '🧴'
where kind = 'official' and normalized_label = '선크림·모자';

insert into public.checklist_items (label, normalized_label, emoji, category, kind, is_shared, review_status)
values ('모자', '모자', '🧢', 'weather', 'official', true, 'approved');

update public.checklist_items
set label = '우비', normalized_label = '우비', emoji = '🌧️'
where kind = 'official' and normalized_label = '우비·우산';

insert into public.checklist_items (label, normalized_label, emoji, category, kind, is_shared, review_status)
values ('우산', '우산', '☔', 'weather', 'official', true, 'approved');
