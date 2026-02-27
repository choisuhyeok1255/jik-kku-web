"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo } from "react";
import {
  useGetGameLogs,
  useGetStadiums,
  useGetTeams,
  useGetUser,
  TeamIcon,
} from "@/src/entities";
import { Header, NotLogin, cn, supabase } from "@/src/shared";

const CARD_BASE =
  "rounded-[20px] border border-white/10 bg-white/[0.04] p-[20px]";

/** 버튼형 카드 (화살표 포함) */
const MyPageCardButton = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) => (
  <button
    type="button"
    className={`${CARD_BASE} flex w-full items-center justify-between`}
    onClick={onClick}
  >
    {children}
    <span className="text-lg font-bold text-white/60">&gt;</span>
  </button>
);

/** 정보 표시형 카드 (아이콘 + 라벨 + 내용) */
const MyPageCard = ({
  icon,
  label,
  children,
  className,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn(CARD_BASE, "flex flex-col gap-[16px]", className)}>
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-[14px] text-[#ffffff]">{label}</span>
    </div>
    <div className="">{children}</div>
  </div>
);

/** 카드 내부 아이콘 래퍼 */
const CardIcon = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={cn(
      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg",
      className,
    )}
  >
    {children}
  </div>
);

const MyPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: teams } = useGetTeams();
  const { data: user, isLoading: isLoadingUser } = useGetUser();
  const { data: stadiums } = useGetStadiums();
  const { data: gameLogs } = useGetGameLogs({
    query: { userId: user?.id || "" },
  });

  const winCount = useMemo(() => {
    return (
      gameLogs?.filter(
        (g) => (g.home_team_score ?? 0) > (g.away_team_score ?? 0),
      ).length ?? 0
    );
  }, [gameLogs]);

  const avgScore = useMemo(() => {
    const withScore = gameLogs?.filter((g) => g.home_team_score != null) ?? [];
    if (withScore.length === 0) return "0점";
    const total = withScore.reduce(
      (sum, g) => sum + (g.home_team_score ?? 0),
      0,
    );
    return `${(total / withScore.length).toFixed(1)}점`;
  }, [gameLogs]);

  const gameCount = gameLogs?.length ?? 0;

  const mostVisitedStadiums = useMemo(() => {
    const withStadium = gameLogs?.filter((g) => g.stadium_id !== null) ?? [];
    if (withStadium.length === 0) return [];

    const countMap = new Map<number, number>();
    for (const g of withStadium) {
      const id = g.stadium_id!;
      countMap.set(id, (countMap.get(id) ?? 0) + 1);
    }

    const maxCount = Math.max(...countMap.values());
    return [...countMap.entries()]
      .filter(([, count]) => count === maxCount)
      .map(([stadiumId]) => stadiumId);
  }, [gameLogs]);

  if (isLoadingUser) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center">
        <span>로딩 중...</span>
      </div>
    );
  }

  if (!user) {
    return <NotLogin />;
  }

  return (
    <div className="flex h-dvh flex-col">
      <Header
        className="mb-[12px] shrink-0"
        title={{ text: "마이페이지", position: "left" }}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-[12px] overflow-y-auto px-[16px] pb-[150px]">
        <MyPageCardButton onClick={() => router.push("/myPage/nickname")}>
          <div className="flex h-[40px] min-w-0 items-center gap-3">
            <CardIcon className="shrink-0 bg-white/10">👤</CardIcon>
            <span className="min-w-0 truncate text-[20px] font-bold text-[#ffffff]">
              {user?.nickname ?? ""}
            </span>
          </div>
        </MyPageCardButton>

        <MyPageCardButton onClick={() => router.push("/myPage/team")}>
          <div className="flex flex-col gap-[16px]">
            {user?.team_id ? (
              <>
                <div className="flex items-center gap-3">
                  <TeamIcon teamId={user.team_id} size={28} />
                  <span className="font-[14px] text-[#ffffff]">응원팀</span>
                </div>
                <span className="text-left text-[20px] font-bold text-[#ffffff]">
                  {teams?.find((t) => t.id === user.team_id)?.team_name}
                </span>
              </>
            ) : (
              <span className="text-[20px] font-bold text-[#ffffff]">
                응원팀을 설정해 주세요
              </span>
            )}
          </div>
        </MyPageCardButton>

        <div className="flex gap-[12px]">
          <MyPageCard
            icon={<CardIcon className="bg-orange-500/80">⚾</CardIcon>}
            label="이긴 횟수"
            className="flex-1"
          >
            <span className="text-[20px] font-bold text-[#ffffff]">
              {winCount}번
            </span>
          </MyPageCard>
          <MyPageCard
            icon={<CardIcon className="bg-blue-500/80">📊</CardIcon>}
            label="평균 점수"
            className="flex-1"
          >
            <span className="text-[20px] font-bold text-[#ffffff]">
              {avgScore}
            </span>
          </MyPageCard>
        </div>

        <MyPageCard
          icon={<CardIcon className="bg-green-600/80">🏟️</CardIcon>}
          label="자주가는 구장"
        >
          <span className="text-xl font-bold text-white">
            {mostVisitedStadiums.length === 0
              ? "-"
              : mostVisitedStadiums
                  .map(
                    (id) =>
                      stadiums?.find((s) => s.id === id)?.name ?? `구장 #${id}`,
                  )
                  .join(", ")}
          </span>
        </MyPageCard>

        <MyPageCard
          icon={<CardIcon className="bg-purple-600/80">⛹️</CardIcon>}
          label="야구장 방문횟수"
        >
          <span className="text-[20px] font-bold text-[#ffffff]">
            {gameCount}경기
          </span>
        </MyPageCard>

        <MyPageCardButton
          onClick={async () => {
            await supabase.auth.signOut();
            queryClient.clear();
            router.push("/");
          }}
        >
          <div className="flex h-[40px] min-w-0 items-center gap-3">
            <CardIcon className="shrink-0 bg-white/10">🚪</CardIcon>
            <span className="min-w-0 truncate text-[20px] font-bold text-[#ffffff]">
              로그아웃
            </span>
          </div>
        </MyPageCardButton>
      </div>
    </div>
  );
};

export default MyPage;
