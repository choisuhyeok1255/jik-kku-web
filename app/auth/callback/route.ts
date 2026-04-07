import { NextResponse } from "next/server";
import {
  OAUTH_POST_LOGIN_COOKIE,
  sanitizeRedirectPath,
} from "@/src/shared/lib/oauth-callback-next";
import createClient from "@/src/shared/lib/supabase/server";

function getCookieValue(request: Request, name: string): string | null {
  const raw = request.headers.get("cookie");
  if (!raw) return null;
  const segments = raw.split("; ");
  for (const seg of segments) {
    if (seg.startsWith(`${name}=`)) {
      return decodeURIComponent(seg.slice(name.length + 1));
    }
  }
  return null;
}

function redirectWithOAuthCookieClear(url: URL | string): NextResponse {
  const res = NextResponse.redirect(url);
  res.cookies.set(OAUTH_POST_LOGIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      let next =
        searchParams.get("next") ??
        getCookieValue(request, OAUTH_POST_LOGIN_COOKIE) ??
        "/";
      next = sanitizeRedirectPath(next);

      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        const redirectUrl = new URL(`${origin}${next}`);
        redirectUrl.hash = ""; // 해시 제거
        return redirectWithOAuthCookieClear(redirectUrl);
      }
      if (forwardedHost) {
        const redirectUrl = new URL(`https://${forwardedHost}${next}`);
        redirectUrl.hash = ""; // 해시 제거
        return redirectWithOAuthCookieClear(redirectUrl);
      }
      const redirectUrl = new URL(`${origin}${next}`);
      redirectUrl.hash = ""; // 해시 제거
      return redirectWithOAuthCookieClear(redirectUrl);
    }
  }

  return redirectWithOAuthCookieClear(`${origin}/auth/auth-code-error`);
}
