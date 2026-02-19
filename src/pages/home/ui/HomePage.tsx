"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useAuthStore } from "@/src/entities";
import { AppTab, supabase } from "@/src/shared";
import { toast } from "sonner";

import WinningRateTabItem from "./WinningRateTabItem";
import GameLogsTabItem from "./GameLogsTabItem";

const HomePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");
  const currentTab: "game" | "gameLogs" =
    tabParam === "gameLogs" ? "gameLogs" : "game";

  const { user, isLoading } = useAuthStore();

  const handleChangeTab = (tab: string) => {
    const newTab = tab as "game" | "gameLogs";
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (newTab === "game") {
      params.delete("tab");
    } else {
      params.set("tab", newTab);
    }
    const queryString = params.toString();
    router.replace(queryString ? `/?${queryString}` : "/");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span>로딩 중...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <button
          onClick={async () => {
            // 이미 로그인된 경우 확인
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
            }
          }}
        >
          kakao 로그인
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col pt-[24px]">
      <AppTab
        className="mx-[40px] mb-[20px]"
        currentTab={currentTab}
        tabItems={[
          { label: "직관", value: "game" },
          { label: "직관 기록", value: "gameLogs" },
        ]}
        handleChangeTab={handleChangeTab}
      />
      {currentTab === "game" && <WinningRateTabItem />}
      {currentTab === "gameLogs" && <GameLogsTabItem />}
    </div>
  );
};

export default HomePage;
