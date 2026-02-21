"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useAuthStore } from "@/src/entities";
import { AppTab, NotLogin } from "@/src/shared";

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
      {currentTab === "game" && <WinningRateTabItem />}
      {currentTab === "gameLogs" && <GameLogsTabItem />}
    </div>
  );
};

export default HomePage;
