"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useGetShares } from "@/src/entities";
import { AppTab } from "@/src/shared";

import ShareExpiredTabItem from "./ShareExpiredTabItem";
import ShareOngoingTabItem from "./ShareOngoingTabItem";

const SharePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");
  const currentTab: "ongoing" | "expired" =
    tabParam === "expired" ? "expired" : "ongoing";

  const { data: shares = [], isLoading } = useGetShares();

  const handleChangeTab = (tab: string) => {
    const newTab = tab as "ongoing" | "expired";
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (newTab === "ongoing") {
      params.delete("tab");
    } else {
      params.set("tab", newTab);
    }
    const queryString = params.toString();
    router.replace(queryString ? `/share?${queryString}` : "/share");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-dvh flex-1 items-center justify-center">
        <span className="text-white/60">로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col pt-[24px]">
      <AppTab
        className="mx-[40px] mb-[20px]"
        currentTab={currentTab}
        tabItems={[
          { label: "진행 중", value: "ongoing" },
          { label: "마감됨", value: "expired" },
        ]}
        handleChangeTab={handleChangeTab}
      />
      {currentTab === "ongoing" && <ShareOngoingTabItem shares={shares} />}
      {currentTab === "expired" && <ShareExpiredTabItem shares={shares} />}
    </div>
  );
};

export default SharePage;
