"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  useAuthStore,
  useGetGameLogsInfinite,
  useGetUserWinStatsSummary,
} from "@/src/entities";
import { AppTab, NotLogin } from "@/src/shared";

import GameLogsTabItem from "./GameLogsTabItem";
import WinningRateTabItem from "./WinningRateTabItem";

const HomePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");
  const initialTab: "game" | "gameLogs" =
    tabParam === "gameLogs" ? "gameLogs" : "game";

  const [currentTab, setCurrentTab] = useState(initialTab);

  const { user, isLoading: isAuthLoading } = useAuthStore();
  const { data: winStatsSummary, isLoading: isWinStatsLoading } =
    useGetUserWinStatsSummary(user?.id || "");
  const {
    data: gameLogsInfinite,
    isLoading: isGameLogsInfiniteLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetGameLogsInfinite({ query: { userId: user?.id || "" } });

  const handleChangeTab = (tab: string) => {
    const newTab = tab as "game" | "gameLogs";
    setCurrentTab(newTab);
    router.push(newTab === "gameLogs" ? "/?tab=gameLogs" : "/");
  };

  useEffect(() => {
    setCurrentTab(initialTab);
  }, [initialTab]);

  if (isAuthLoading || isWinStatsLoading || isGameLogsInfiniteLoading) {
    return (
      <div className="flex min-h-dvh flex-1 items-center justify-center">
        <span className="text-white/60">로딩 중...</span>
      </div>
    );
  }

  if (!user) {
    return <NotLogin />;
  }

  return (
    <div className="flex h-full flex-col pt-[24px]">
      <AppTab
        className="absolute top-[24px] right-0 left-0 z-10 mx-auto mb-[20px] w-[calc(100%-32px)]"
        currentTab={currentTab}
        tabItems={[
          { label: "직관", value: "game" },
          { label: "직관 기록", value: "gameLogs" },
        ]}
        handleChangeTab={handleChangeTab}
      />
      {currentTab === "game" && (
        <WinningRateTabItem
          wins={winStatsSummary?.wins ?? 0}
          total={winStatsSummary?.total ?? 0}
        />
      )}
      {currentTab === "gameLogs" && (
        <GameLogsTabItem
          gameLogs={gameLogsInfinite || { pages: [], pageParams: [] }}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
        />
      )}
    </div>
  );
};

export default HomePage;
