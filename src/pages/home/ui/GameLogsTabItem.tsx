import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  GAME_LOGS_PAGE_SIZE,
  useAuthStore,
  useGetGameLogsInfinite,
} from "@/src/entities";

import GameLogsItem from "./GameLogsItem";

const GameLogsTabItem = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollToId = searchParams?.get("scrollTo");
  const hasScrolledRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { user, isLoading: isAuthLoading } = useAuthStore();

  const {
    data,
    isLoading: isGameLogsLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetGameLogsInfinite({
    query: { userId: user?.id || "" },
  });

  const gameLogs = data?.pages.flatMap((page) => page) ?? [];

  useEffect(() => {
    if (
      !scrollToId ||
      isAuthLoading ||
      isGameLogsLoading ||
      !gameLogs.length ||
      hasScrolledRef.current
    )
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
  }, [
    scrollToId,
    isAuthLoading,
    isGameLogsLoading,
    gameLogs.length,
    searchParams,
    router,
  ]);

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

  if (isAuthLoading || isGameLogsLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="text-white/60">로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-[16px] overflow-y-auto px-[16px] pb-[116px]">
      {gameLogs.map((gameLog, index) => (
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
