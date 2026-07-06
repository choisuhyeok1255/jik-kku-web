-- 커스텀(unofficial) 항목 승격 시 같은 이름 중복 병합 함수
-- 대상 항목을 official로 올리고(같은 이름 official이 이미 있으면 그 기존 official로 합침),
-- 같은 normalized_label을 가진 다른 항목들의 유저 체크기록을 대표 항목으로 이전한 뒤
-- (한 유저가 둘 다 가진 경우 체크 상태는 OR로 보존) 비워진 중복 항목을 삭제한다.
-- 여러 테이블을 원자적으로 바꿔야 하고 다른 유저의 데이터도 건드리므로 security definer + 관리자 확인.

create or replace function public.promote_checklist_item(target_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_norm text;
  v_canonical uuid;
begin
  -- 관리자만 실행 (RLS 정책과 동일한 하드코딩 UID)
  if auth.uid() <> '3d6f7e16-c6bd-4a88-afe9-bf9fbbc8c004'::uuid then
    raise exception 'not authorized';
  end if;

  select normalized_label into v_norm from checklist_items where id = target_id;
  if v_norm is null then
    raise exception 'checklist item % not found', target_id;
  end if;

  -- 같은 이름의 기존 official (대상 제외) → 있으면 그게 대표
  select id into v_canonical
  from checklist_items
  where normalized_label = v_norm and kind = 'official' and id <> target_id
  limit 1;

  -- 없으면 대상을 승격, 대상이 대표
  if v_canonical is null then
    update checklist_items set kind = 'official' where id = target_id;
    v_canonical := target_id;
  end if;

  -- (a) 유저가 대표를 이미 가진 경우: 중복 항목의 체크 상태를 OR로 병합
  update user_checklist_entries c
  set is_checked = c.is_checked or agg.any_checked,
      updated_at = now()
  from (
    select d.user_id, bool_or(d.is_checked) as any_checked
    from user_checklist_entries d
    join checklist_items di on di.id = d.item_id
    where di.normalized_label = v_norm and d.item_id <> v_canonical
    group by d.user_id
  ) agg
  where c.item_id = v_canonical and c.user_id = agg.user_id;

  -- (a-2) 대표를 이미 가진 유저의 중복 엔트리 삭제 (unique(user_id,item_id) 충돌 방지)
  delete from user_checklist_entries d
  using checklist_items di
  where di.id = d.item_id
    and di.normalized_label = v_norm
    and d.item_id <> v_canonical
    and exists (
      select 1 from user_checklist_entries c
      where c.item_id = v_canonical and c.user_id = d.user_id
    );

  -- (b) 나머지(대표 미보유) 엔트리는 대표로 재지정
  update user_checklist_entries d
  set item_id = v_canonical
  from checklist_items di
  where di.id = d.item_id
    and di.normalized_label = v_norm
    and d.item_id <> v_canonical;

  -- 비워진 중복 항목 삭제
  delete from checklist_items
  where normalized_label = v_norm and id <> v_canonical;

  return v_canonical;
end;
$$;

grant execute on function public.promote_checklist_item(uuid) to authenticated;
