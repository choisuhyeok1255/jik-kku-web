/** OAuth 후 이동 경로. redirectTo에 쿼리를 붙이면 Supabase Redirect URL과 불일치해 Site URL로 폴백될 수 있어 쿠키로 전달한다. */
export const OAUTH_POST_LOGIN_COOKIE = "oauth_post_login_path";

export function sanitizeRedirectPath(path: string | null): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/";
  return path;
}
