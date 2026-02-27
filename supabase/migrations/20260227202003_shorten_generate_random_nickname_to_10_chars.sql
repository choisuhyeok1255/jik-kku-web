-- 초기 닉네임 난수 길이: 37자 → 10자 (user_ + 5자 hex)
create or replace function public.generate_random_nickname()
returns text
language sql
as $$
  select 'user_' || substring(replace(gen_random_uuid()::text, '-', ''), 1, 5);
$$;
