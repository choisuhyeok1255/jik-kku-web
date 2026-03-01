"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  useAuthStore,
  useGetGameLogs,
  useGetGameLogsInfinite,
} from "@/src/entities";
import { AppTab, NotLogin } from "@/src/shared";

import GameLogsTabItem from "./GameLogsTabItem";
import WinningRateTabItem from "./WinningRateTabItem";

const HomePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");
  const currentTab: "game" | "gameLogs" =
    tabParam === "gameLogs" ? "gameLogs" : "game";

  const { user, isLoading: isAuthLoading } = useAuthStore();
  const { data: gameLogs, isLoading: isGameLogsLoading } = useGetGameLogs({
    query: { userId: user?.id || "" },
  });
  const {
    data: gameLogsInfinite,
    isLoading: isGameLogsInfiniteLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetGameLogsInfinite({
    query: { userId: user?.id || "" },
  });

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

  if (isAuthLoading || isGameLogsLoading || isGameLogsInfiniteLoading) {
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
        className="mx-[40px] mb-[20px]"
        currentTab={currentTab}
        tabItems={[
          { label: "직관", value: "game" },
          { label: "직관 기록", value: "gameLogs" },
        ]}
        handleChangeTab={handleChangeTab}
      />
      {currentTab === "game" && (
        <WinningRateTabItem gameLogs={gameLogs || []} />
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
