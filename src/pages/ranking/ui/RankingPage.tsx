"use client";

import Medal1Icon from "@/public/medal-1.svg";
import Medal2Icon from "@/public/medal-2.svg";
import Medal3Icon from "@/public/medal-3.svg";
import { useAuthStore, useGetUserWinStatsRanking } from "@/src/entities";
import { Header, Notification } from "@/src/shared";
import { cn } from "@/src/shared";

const RankingPage = () => {
  const { user: currentUser } = useAuthStore();
  const { data: ranking, isLoading, error } = useGetUserWinStatsRanking();

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <span className="text-center text-white/60">랭킹을 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <span className="text-center text-red-400">
          랭킹을 불러오지 못했어요.
        </span>
      </div>
    );
  }

  if (ranking && ranking.length === 0) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <span className="text-center text-white/60">
          아직 랭킹이 비어있어요.
          <br />
          직관을 등록하고 1등에 도전해봐요! ✨
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col">
      <Header
        className="mb-[12px] shrink-0"
        title={{ text: "직관 랭킹", position: "left" }}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[16px] pb-[100px]">
        <Notification text="인증된 직관 기록만 집계되어 승률이 계산됩니다 ✨" />
        <div className="mt-[24px] flex flex-col gap-[16px]">
          {ranking?.map((user, i) => (
            <div
              key={i}
              className={cn(
                "flex h-[68px] items-center gap-[16px] rounded-[20px] border p-[20px]",
                user.user_id === currentUser?.id
                  ? "border-[#5724F0] bg-[#5724F0]/4"
                  : "border-white/10 bg-[#FFFFFF]/4",
              )}
            >
              <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center">
                {i === 0 && <Medal1Icon className="h-[28px] w-[28px]" />}
                {i === 1 && <Medal2Icon className="h-[28px] w-[28px]" />}
                {i === 2 && <Medal3Icon className="h-[28px] w-[28px]" />}
                {i >= 3 && (
                  <div className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-white/10 text-[14px] font-bold text-[#FFFFFF]">
                    {i + 1}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[16px] font-bold text-white">
                  {user.nickname ?? "알 수 없음"}
                </div>
              </div>
              <div className="shrink-0 text-[24px] font-bold text-[#FFFFFF]">
                {user.win_rate != null ? `${user.win_rate}%` : "-"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
