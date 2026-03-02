"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useGetShares } from "@/src/entities";
import { AppTab } from "@/src/shared";

import ShareExpiredTabItem from "./ShareExpiredTabItem";
import ShareOngoingTabItem from "./ShareOngoingTabItem";

const SharePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");
  const initialTab = tabParam === "expired" ? "expired" : "ongoing";

  const [currentTab, setCurrentTab] = useState(initialTab);

  const { data: shares = [], isLoading } = useGetShares();

  const handleChangeTab = (tab: string) => {
    const newTab = tab as "ongoing" | "expired";
    router.push(newTab === "expired" ? "/share?tab=expired" : "/share");
    setCurrentTab(newTab);
  };

  useEffect(() => {
    setCurrentTab(initialTab);
  }, [initialTab]);

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
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <span className="text-white/60">로딩 중...</span>
        </div>
      ) : (
        <>
          {currentTab === "ongoing" && <ShareOngoingTabItem shares={shares} />}
          {currentTab === "expired" && <ShareExpiredTabItem shares={shares} />}
        </>
      )}
    </div>
  );
};

export default SharePage;
