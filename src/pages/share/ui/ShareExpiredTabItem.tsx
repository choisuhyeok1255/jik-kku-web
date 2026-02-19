"use client";

import { useMemo } from "react";

import { useGetShares } from "@/src/entities";

import { isShareExpired } from "../lib/isShareExpired";
import ShareItem from "./ShareItem";

const ShareExpiredTabItem = () => {
  const { data: shares = [], isLoading } = useGetShares();

  const expiredShares = useMemo(
    () => shares.filter((share) => isShareExpired(share.deadline)),
    [shares],
  );

  if (isLoading) {
    return (
      <div className="py-[40px] text-center text-white/60">로딩 중...</div>
    );
  }

  if (expiredShares.length === 0) {
    return (
      <div className="py-[40px] text-center text-white/60">
        마감된 나눔이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[16px] overflow-y-auto px-[16px] pb-[116px]">
      {expiredShares.map((share, index) => (
        <ShareItem
          key={share.id}
          share={share}
          enterDelay={index * 80}
        />
      ))}
    </div>
  );
};

export default ShareExpiredTabItem;
