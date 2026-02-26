"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/src/entities";
import { supabase } from "@/src/shared";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setIsLoading } = useAuthStore();

  // 전역 인증 상태 관리
  useEffect(() => {
    // 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setIsLoading]);

  return children;
};

export default AuthProvider;
