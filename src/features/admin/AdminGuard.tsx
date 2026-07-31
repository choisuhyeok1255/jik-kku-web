"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/src/entities";
import { supabase } from "@/src/shared";
import {
  OAUTH_POST_LOGIN_COOKIE,
  sanitizeRedirectPath,
} from "@/src/shared/lib/oauth-callback-next";

const ADMIN_USER_ID = "3d6f7e16-c6bd-4a88-afe9-bf9fbbc8c004";

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuthStore();

  const handleLogin = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      toast.info("이미 로그인되어 있습니다.");
      return;
    }

    const nextPath = sanitizeRedirectPath(
      `${window.location.pathname}${window.location.search}`,
    );
    document.cookie = `${OAUTH_POST_LOGIN_COOKIE}=${encodeURIComponent(nextPath)}; Path=/; Max-Age=600; SameSite=Lax`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("로그인 오류:", error);
      toast.error("로그인에 실패했습니다.");
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#0a0a0a]">
        <span className="text-white/60">로딩 중...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-[#0a0a0a] px-4">
        <h1 className="text-center text-2xl font-bold text-white">
          직꾸 어드민
        </h1>
        <p className="text-center text-[15px] text-white/70">
          관리자 로그인이 필요합니다
        </p>
        <button
          type="button"
          onClick={handleLogin}
          className="h-[56px] w-full max-w-[280px] rounded-[20px] bg-[#5724F0] text-[16px] font-medium text-white transition-opacity hover:opacity-90"
        >
          카카오로 로그인
        </button>
      </div>
    );
  }

  if (user.id !== ADMIN_USER_ID) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-[#0a0a0a] px-4">
        <p className="text-center text-[16px] text-white/70">
          관리자 권한이 없는 계정이에요
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="h-[48px] w-full max-w-[280px] rounded-[20px] border border-white/20 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
        >
          로그아웃 후 다른 계정으로 로그인
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
