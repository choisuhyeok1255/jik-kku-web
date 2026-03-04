import { InfiniteData } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { GAME_LOGS_PAGE_SIZE } from "@/src/entities";

import EmptyGameLog from "./EmptyGameLog";
import GameLogsItem from "./GameLogsItem";

const GameLogsTabItem = ({
  gameLogs,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: {
  gameLogs: InfiniteData<
    {
      id: number;
      home_team_id: number | null;
      away_team_id: number | null;
      home_team_score: number | null;
      away_team_score: number | null;
      match_date: string | null;
      note: string | null;
      game_log_image: string | null;
      game_log_image_thumbnail: string | null;
      is_certified: boolean;
      is_admin_certified: boolean;
      stadium_id: number | null;
      youtube_url: string | null;
    }[],
    unknown
  >;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollToId = searchParams?.get("scrollTo");
  const hasScrolledRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const flatGameLogs = gameLogs?.pages.flatMap((page) => page) ?? [];

  useEffect(() => {
    if (!scrollToId || !flatGameLogs.length || hasScrolledRef.current) return;

    const el = document.getElementById(`game-log-${scrollToId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      hasScrolledRef.current = true;

      const params = new URLSearchParams(searchParams?.toString() ?? "");
      params.delete("scrollTo");
      const queryString = params.toString();
      router.replace(queryString ? `/?${queryString}` : "/", { scroll: false });
    }
  }, [scrollToId, flatGameLogs.length, searchParams, router]);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "100px", threshold: 0 },
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (flatGameLogs.length === 0) {
    return <EmptyGameLog />;
  }

  return (
    <div className="flex flex-1 flex-col gap-[16px] overflow-y-auto px-[16px] pb-[116px]">
      {flatGameLogs.map((gameLog, index) => (
        <GameLogsItem
          key={gameLog.id}
          enterDelay={index * 80}
          animate={index < GAME_LOGS_PAGE_SIZE}
          gameLog={{
            game_log_id: gameLog.id || 0,
            home_team_score: gameLog.home_team_score || 0,
            away_team_score: gameLog.away_team_score || 0,
            home_team_id: gameLog.home_team_id || 0,
            away_team_id: gameLog.away_team_id || 0,
            match_date: gameLog.match_date || "",
            game_log_image_thumbnail: gameLog.game_log_image_thumbnail || "",
            note: gameLog.note || "",
            is_certified: gameLog.is_certified || false,
            is_admin_certified: gameLog.is_admin_certified || false,
            stadium_id: gameLog.stadium_id ?? null,
            youtube_url: gameLog.youtube_url ?? null,
          }}
        />
      ))}
      <div ref={sentinelRef} className="h-px" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-[16px]">
          <span className="text-[14px] text-white/40">로딩 중...</span>
        </div>
      )}
    </div>
  );
};

export default GameLogsTabItem;
