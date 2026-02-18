"use client";

import { useMemo } from "react";

import { useGetShares } from "@/src/entities";

import { isShareExpired } from "../lib/isShareExpired";
import ShareItem from "./ShareItem";

const ShareOngoingTabItem = () => {
  const { data: shares = [], isLoading } = useGetShares();

  const ongoingShares = useMemo(
    () => shares.filter((share) => !isShareExpired(share.deadline)),
    [shares],
  );

  if (isLoading) {
    return (
      <div className="py-[40px] text-center text-white/60">로딩 중...</div>
    );
  }

  if (ongoingShares.length === 0) {
    return (
      <div className="py-[40px] text-center text-white/60">
        진행 중인 나눔이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-[16px] overflow-y-auto px-[16px] pb-[116px]">
      {ongoingShares.map((share, index) => (
        <ShareItem
          key={share.id}
          share={share}
          enterDelay={index * 80}
        />
      ))}
    </div>
  );
};

export default ShareOngoingTabItem;
