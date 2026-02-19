"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Header, AppTab } from "@/src/shared";

import ShareExpiredTabItem from "./ShareExpiredTabItem";
import ShareOngoingTabItem from "./ShareOngoingTabItem";

const SharePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");
  const currentTab: "ongoing" | "expired" =
    tabParam === "expired" ? "expired" : "ongoing";

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

  return (
    <div className="flex h-screen flex-col">
      <Header
        className="mb-[12px] shrink-0"
        title={{ text: "나눔", position: "left" }}
      />
      <div className="flex min-h-0 flex-1 flex-col pt-[8px]">
        <div className="mb-[12px] px-[16px]">
          <AppTab
            className="mx-0"
            currentTab={currentTab}
            tabItems={[
              { label: "진행 중", value: "ongoing" },
              { label: "마감됨", value: "expired" },
            ]}
            handleChangeTab={handleChangeTab}
          />
          <div className="mt-[12px] flex justify-end">
            <Link
              href="/share/create"
              className="rounded-[20px] bg-[#5724F0] px-[16px] py-[10px] text-[14px] font-medium"
            >
              등록
            </Link>
          </div>
        </div>
        {currentTab === "ongoing" && <ShareOngoingTabItem />}
        {currentTab === "expired" && <ShareExpiredTabItem />}
      </div>
    </div>
  );
};

export default SharePage;
