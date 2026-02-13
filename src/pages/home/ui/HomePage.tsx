"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  useAuthStore,
  useDeleteGameLog,
  useGetGameLogs,
  gameLogKeys,
  useGetTeams,
} from "@/src/entities";
import { AppTab, supabase } from "@/src/shared";

import WinningRateTabItem from "./WinningRateTabItem";
import GameLogsTabItem from "./GameLogsTabItem";

const HomePage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { user, isLoading } = useAuthStore();

  // 로그인한 사용자의 직관 데이터 가져오기
  const { data: gameLogs, isLoading: isLoadingLogs } = useGetGameLogs({
    query: { userId: user?.id || "" },
  });
  const { data: teams } = useGetTeams();
  const { mutate: deleteGameLog } = useDeleteGameLog();

  const [currentTab, setCurrentTab] = useState<"game" | "gameLogs">("game");

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
              alert("이미 로그인되어 있습니다.");
              return;
            }

            const { error } = await supabase.auth.signInWithOAuth({
              provider: "kakao",
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
        handleChangeTab={(tab) => setCurrentTab(tab as "game" | "gameLogs")}
      />
      {currentTab === "game" && <WinningRateTabItem />}
      {currentTab === "gameLogs" && <GameLogsTabItem />}
    </div>
  );
};

export default HomePage;
