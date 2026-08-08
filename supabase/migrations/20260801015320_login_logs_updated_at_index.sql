-- "최근 접속한 유저 순" 조회용 인덱스.
--
-- login_logs가 유저당 1행으로 바뀌면서 마지막 접속 시각이 created_at에서 updated_at으로 옮겨갔다.
-- 대시보드가 보는 것도 그쪽이라, 정렬 기준이 되는 컬럼에 인덱스를 맞춰 준다.
-- created_at 인덱스는 "최초 접속(가입 후 첫 진입) 순"에 여전히 쓰이므로 남겨 둔다.

create index login_logs_updated_at_idx on public.login_logs (updated_at desc);
