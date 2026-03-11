"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Medal1Icon from "@/public/medal-1.svg";
import Medal2Icon from "@/public/medal-2.svg";
import Medal3Icon from "@/public/medal-3.svg";
import {
  useAuthStore,
  useGetUserWinStatsRanking,
  UserWinStatsRow,
  type RankingSortBy,
} from "@/src/entities";
import { AppTab, AvatarIcon, Notification } from "@/src/shared";
import { cn } from "@/src/shared";

const RankingPage = ({
  initialRankingByWinRate,
  initialRankingByTotalGames,
}: {
  initialRankingByWinRate: UserWinStatsRow[];
  initialRankingByTotalGames: UserWinStatsRow[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortBy: RankingSortBy =
    searchParams?.get("tab") === "total_games" ? "total_games" : "win_rate";

  const { user: currentUser } = useAuthStore();
  const { data: rankingByWinRate, error: errorWinRate } =
    useGetUserWinStatsRanking({
      sortBy: "win_rate",
      initialData: initialRankingByWinRate,
    });
  const { data: rankingByTotalGames, error: errorTotalGames } =
    useGetUserWinStatsRanking({
      sortBy: "total_games",
      initialData: initialRankingByTotalGames,
    });

  const error = errorWinRate ?? errorTotalGames;
  const ranking =
    sortBy === "win_rate" ? rankingByWinRate : rankingByTotalGames;

  const handleChangeTab = (tab: string) => {
    const newTab = tab as RankingSortBy;
    router.push(
      newTab === "total_games" ? "/ranking?tab=total_games" : "/ranking",
    );
  };

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
          직관을 등록하고 1등에 도전해봐요!
        </span>
      </div>
    );
  }

  const notificationText =
    sortBy === "win_rate"
      ? "인증된 직관 기록만 집계되어 승률이 계산됩니다"
      : "인증된 직관 기록만 집계되어 직관 경기수가 계산됩니다";

  return (
    <div className="flex h-dvh flex-col">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[16px] pt-[24px] pb-[100px]">
        <AppTab
          className="mx-auto mb-[20px]"
          currentTab={sortBy}
          tabItems={[
            { label: "승률순", value: "win_rate" },
            { label: "직관 경기수 순", value: "total_games" },
          ]}
          handleChangeTab={handleChangeTab}
        />
        <Notification text={notificationText} />
        <p className="mt-[8px] text-[12px] text-white/50">
          데이터는 1분마다 갱신됩니다.
        </p>
        <div className="mt-[24px] flex flex-col gap-[16px]">
          {ranking?.map((user, i) => (
            <div
              key={i}
              className={cn(
                "flex h-[68px] items-center gap-[8px] rounded-[20px] border p-[20px]",
                user.user_id === currentUser?.id
                  ? "border-[#5724F0] bg-[#5724F0]/4"
                  : "border-white/10 bg-[#FFFFFF]/4",
              )}
            >
              <div className="flex shrink-0 items-center gap-[12px]">
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
                {user.avatar && <AvatarIcon iconName={user.avatar} size={28} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[16px] font-bold text-white">
                  {user.nickname ?? "알 수 없음"}
                </div>
              </div>
              <div className="shrink-0 text-[24px] font-bold text-[#FFFFFF]">
                {sortBy === "total_games"
                  ? user.total_games != null
                    ? `${user.total_games}경기`
                    : "-"
                  : user.win_rate != null
                    ? `${user.win_rate}%`
                    : "-"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
