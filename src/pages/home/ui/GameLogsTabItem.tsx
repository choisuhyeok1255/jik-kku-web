import { useAuthStore, useGetGameLogs } from "@/src/entities";

import GameLogsItem from "./GameLogsItem";

const GameLogsTabItem = () => {
  const { user, isLoading } = useAuthStore();

  const { data: gameLogs = [] } = useGetGameLogs({
    query: { userId: user?.id || "" },
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-[16px] overflow-y-auto px-[16px] pb-[116px]">
      {gameLogs.map((gameLog) => (
        <GameLogsItem
          key={gameLog.id}
          gameLog={{
            home_team_score: gameLog.home_team_score || 0,
            away_team_score: gameLog.away_team_score || 0,
            home_team_id: gameLog.home_team_id || 0,
            away_team_id: gameLog.away_team_id || 0,
            match_date: gameLog.match_date || "",
            game_log_image: gameLog.game_log_image || "",
            note: gameLog.note || "",
            is_certify: gameLog.is_certify || false,
          }}
        />
      ))}
    </div>
  );
};

export default GameLogsTabItem;
