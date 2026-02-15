import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuthStore, useGetGameLogs } from "@/src/entities";

import GameLogsItem from "./GameLogsItem";

const GameLogsTabItem = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollToId = searchParams?.get("scrollTo");
  const hasScrolledRef = useRef(false);

  const { user, isLoading } = useAuthStore();

  const { data: gameLogs = [] } = useGetGameLogs({
    query: { userId: user?.id || "" },
  });

  useEffect(() => {
    if (!scrollToId || isLoading || !gameLogs.length || hasScrolledRef.current)
      return;

    const el = document.getElementById(`game-log-${scrollToId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      hasScrolledRef.current = true;

      const params = new URLSearchParams(searchParams?.toString() ?? "");
      params.delete("scrollTo");
      const queryString = params.toString();
      router.replace(queryString ? `/?${queryString}` : "/", { scroll: false });
    }
  }, [scrollToId, isLoading, gameLogs.length, searchParams, router]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-[16px] overflow-y-auto px-[16px] pb-[116px]">
      {gameLogs.map((gameLog, index) => (
        <GameLogsItem
          key={gameLog.id}
          enterDelay={index * 80}
          gameLog={{
            game_log_id: gameLog.id || 0,
            home_team_score: gameLog.home_team_score || 0,
            away_team_score: gameLog.away_team_score || 0,
            home_team_id: gameLog.home_team_id || 0,
            away_team_id: gameLog.away_team_id || 0,
            match_date: gameLog.match_date || "",
            game_log_image: gameLog.game_log_image || "",
            note: gameLog.note || "",
            is_certify: gameLog.is_certify || false,
            stadium_id: gameLog.stadium_id ?? null,
          }}
        />
      ))}
    </div>
  );
};

export default GameLogsTabItem;
