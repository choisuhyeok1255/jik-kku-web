"use client";

import { supabase } from "@/src/shared";
import { toast } from "sonner";
import { cn } from "../lib/tailwind";

interface NotLoginProps {
  /** 안내 문구 (기본: "로그인이 필요한 서비스예요") */
  message?: string;
  /** 전체 화면 높이 사용 여부 (기본: true) */
  fullHeight?: boolean;
  className?: string;
}

const NotLogin = ({
  message = "로그인이 필요한 서비스예요",
  fullHeight = true,
  className,
}: NotLoginProps) => {
  const handleLogin = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      toast.info("이미 로그인되어 있습니다.");
      return;
    }

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
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-[24px] px-[24px]",
        fullHeight && "min-h-screen",
        className,
      )}
    >
      <p className="text-center text-[16px] text-white/70">{message}</p>
      <button
        type="button"
        onClick={handleLogin}
        className="h-[56px] w-full max-w-[280px] rounded-[20px] bg-[#5724F0] text-[16px] font-medium text-white transition-opacity hover:opacity-90"
      >
        카카오로 로그인
      </button>
    </div>
  );
};

export default NotLogin;
