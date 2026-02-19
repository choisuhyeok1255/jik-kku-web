import { NextResponse } from "next/server";
import createClient from "@/src/shared/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        const redirectUrl = new URL(`${origin}${next}`);
        redirectUrl.hash = ""; // 해시 제거
        return NextResponse.redirect(redirectUrl);
      } else if (forwardedHost) {
        const redirectUrl = new URL(`https://${forwardedHost}${next}`);
        redirectUrl.hash = ""; // 해시 제거
        return NextResponse.redirect(redirectUrl);
      } else {
        const redirectUrl = new URL(`${origin}${next}`);
        redirectUrl.hash = ""; // 해시 제거
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
