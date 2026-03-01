import type { Metadata } from "next";

import { RankingPage } from "@/src/pages/ranking";
import { getUserWinStatsRanking } from "@/src/entities";

export const metadata: Metadata = {
  title: "직관 랭킹 | 승요",
  description: "야구 직관 승률 랭킹. 인증된 직관 기록만 집계됩니다.",
  alternates: { canonical: "/ranking" },
  openGraph: {
    title: "직관 랭킹 | 승요",
    description: "야구 직관 승률 랭킹. 인증된 직관 기록만 집계됩니다.",
    url: "/ranking",
    siteName: "승요",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "직관 랭킹 | 승요",
    description: "야구 직관 승률 랭킹. 인증된 직관 기록만 집계됩니다.",
  },
};

export const revalidate = 60; // 60초마다 재생성

export default async function Page() {
  const ranking = await getUserWinStatsRanking();

  return <RankingPage initialRanking={ranking} />;
}
