"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { useGetCertifyGameLogs, useGetUser } from "@/src/entities";
import { Header, cn } from "@/src/shared";

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
      <span className="text-base text-white/60">{label}</span>
    </div>
    <div className="pl-11">{children}</div>
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
  const { data: user } = useGetUser();
  const { data: certifyGameLogs } = useGetCertifyGameLogs({
    query: { userId: user?.id || "" },
  });

  const winCount = useMemo(() => {
    return (
      certifyGameLogs?.filter(
        (g) => (g.home_team_score ?? 0) > (g.away_team_score ?? 0),
      ).length ?? 0
    );
  }, [certifyGameLogs]);

  const avgScore = useMemo(() => {
    const withScore =
      certifyGameLogs?.filter((g) => g.home_team_score != null) ?? [];
    if (withScore.length === 0) return "0점";
    const total = withScore.reduce(
      (sum, g) => sum + (g.home_team_score ?? 0),
      0,
    );
    return `${(total / withScore.length).toFixed(1)}점`;
  }, [certifyGameLogs]);

  const gameCount = certifyGameLogs?.length ?? 0;

  return (
    <div className="flex h-screen flex-col">
      <Header
        className="mb-[12px] shrink-0"
        title={{ text: "마이페이지", position: "left" }}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-[12px] overflow-y-auto px-[16px] pb-[100px]">
        <MyPageCardButton onClick={() => console.log("click")}>
          <div className="flex items-center gap-3">
            <CardIcon className="bg-white/10">👤</CardIcon>
            <span className="text-lg font-bold text-white">
              {user?.nickname ?? ""}
            </span>
          </div>
        </MyPageCardButton>

        <MyPageCardButton onClick={() => console.log("click")}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <CardIcon className="bg-red-600/80">🎯</CardIcon>
              <span className="text-base text-white/60">응원팀</span>
            </div>
            <span className="pl-11 text-xl font-bold text-white">
              SSG 랜더스
            </span>
          </div>
        </MyPageCardButton>

        <div className="flex gap-[12px]">
          <MyPageCard
            icon={<CardIcon className="bg-orange-500/80">⚾</CardIcon>}
            label="응원팀 이긴 횟수"
            className="flex-1"
          >
            <span className="text-2xl font-bold text-white">{winCount}번</span>
          </MyPageCard>
          <MyPageCard
            icon={<CardIcon className="bg-blue-500/80">📊</CardIcon>}
            label="응원팀 평균 점수"
            className="flex-1"
          >
            <span className="text-2xl font-bold text-white">{avgScore}</span>
          </MyPageCard>
        </div>

        <MyPageCard
          icon={<CardIcon className="bg-green-600/80">🏟️</CardIcon>}
          label="내가 자주가는 구장"
        >
          <span className="text-xl font-bold text-white">
            인천 SSG 랜더스필드
          </span>
        </MyPageCard>

        <MyPageCard
          icon={<CardIcon className="bg-purple-600/80">⛹️</CardIcon>}
          label="야구장 방문횟수"
        >
          <span className="text-xl font-bold text-white">{gameCount}경기</span>
        </MyPageCard>
      </div>
    </div>
  );
};

export default MyPage;
