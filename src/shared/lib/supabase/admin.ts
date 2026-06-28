import "server-only";

import { createClient } from "@supabase/supabase-js";

import { Database } from "../supabase.types";

/**
 * 서버 전용 Supabase 클라이언트 (service role 키).
 * - RLS(행 수준 보안)를 우회하므로 크론 등 세션 없는 서버 작업에서 직접 읽기·쓰기에 쓴다.
 * - `service_role` 키는 절대 클라이언트 번들에 노출되면 안 되므로 `server-only`로 보호한다.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.",
    );
  }

  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
