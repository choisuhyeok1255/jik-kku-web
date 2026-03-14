"use client";

import { useMemo } from "react";

import { ShareServerModel } from "@/src/entities";
import { isShareExpired } from "../lib/isShareExpired";
import ShareItem from "./ShareItem";

const ShareOngoingTabItem = ({ shares }: { shares: ShareServerModel[] }) => {
  const ongoingShares = useMemo(
    () => shares.filter((share) => !isShareExpired(share.deadline)),
    [shares],
  );

  if (ongoingShares.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center pt-[88px]">
        <span className="text-center text-white/60">
          진행 중인 나눔이 없습니다.
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[16px] overflow-y-auto px-[16px] pt-[88px] pb-[116px]">
      {ongoingShares.map((share, index) => (
        <ShareItem key={share.id} share={share} enterDelay={index * 80} />
      ))}
    </div>
  );
};

export default ShareOngoingTabItem;
