import type { Metadata } from "next";
import { Suspense } from "react";

import { RankingPage } from "@/src/pages/ranking";
import { getUserWinStatsRanking } from "@/src/entities";

export const metadata: Metadata = {
  title: "직관 랭킹 | 직꾸",
  description: "야구 직관 승률 랭킹. 인증된 직관 기록만 집계됩니다.",
  alternates: { canonical: "/ranking" },
  openGraph: {
    title: "직관 랭킹 | 직꾸",
    description: "야구 직관 승률 랭킹. 인증된 직관 기록만 집계됩니다.",
    url: "/ranking",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "직관 랭킹 | 직꾸",
    description: "야구 직관 승률 랭킹. 인증된 직관 기록만 집계됩니다.",
  },
};

export const revalidate = 60; // 60초마다 재생성

export default async function Page() {
  const [rankingByWinRate, rankingByTotalGames] = await Promise.all([
    getUserWinStatsRanking("win_rate"),
    getUserWinStatsRanking("total_games"),
  ]);

  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center">
          로딩 중...
        </div>
      }
    >
      <RankingPage
        initialRankingByWinRate={rankingByWinRate}
        initialRankingByTotalGames={rankingByTotalGames}
      />
    </Suspense>
  );
}
