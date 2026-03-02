"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ShareServerModel, useGetShares } from "@/src/entities";
import { AppTab } from "@/src/shared";

import ShareExpiredTabItem from "./ShareExpiredTabItem";
import ShareOngoingTabItem from "./ShareOngoingTabItem";

const SharePage = ({
  initialShares,
  initialTab,
}: {
  initialShares: ShareServerModel[];
  initialTab: "ongoing" | "expired";
}) => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(initialTab);

  const { data: shares = [] } = useGetShares({
    initialData: initialShares,
  });

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
      {currentTab === "ongoing" && <ShareOngoingTabItem shares={shares} />}
      {currentTab === "expired" && <ShareExpiredTabItem shares={shares} />}
    </div>
  );
};

export default SharePage;
