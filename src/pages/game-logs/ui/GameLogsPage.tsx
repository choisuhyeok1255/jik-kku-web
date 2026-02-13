"use client";

import { useGetGameLogs, useAuthStore } from "@/src/entities";
import Link from "next/link";

const GameLogsPage = () => {
  const { user } = useAuthStore();
  const { data: gameLogs } = useGetGameLogs({
    query: { userId: user?.id || "" },
  });

  return (
    <div>
      <Link href="game-logs/create">게임 기록 생성</Link>
      {gameLogs?.map((gameLog) => (
        <div key={gameLog.id}>
          <Link href={`game-logs/${gameLog.id}`}>{gameLog.match_date}</Link>
        </div>
      ))}
    </div>
  );
};

export default GameLogsPage;
