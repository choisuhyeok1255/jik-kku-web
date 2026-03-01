import { RankingPage } from "@/src/pages/ranking";
import { getUserWinStatsRanking } from "@/src/entities";

export const revalidate = 60; // 60초마다 재생성

export default async function Page() {
  const ranking = await getUserWinStatsRanking();

  return <RankingPage initialRanking={ranking} />;
}
