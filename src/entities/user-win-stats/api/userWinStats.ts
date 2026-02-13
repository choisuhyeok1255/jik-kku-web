import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/src/shared";
import type { UserWinStatsRow } from "../model/types/api";

export const userWinStatsKeys = {
  all: ["user_win_stats"] as const,
  ranking: () => [...userWinStatsKeys.all, "ranking"] as const,
} as const;

/** 직관 승률 랭킹 조회 (승률 높은 순) */
export const useGetUserWinStatsRanking = () => {
  return useQuery({
    queryKey: userWinStatsKeys.ranking(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_win_stats")
        .select("*")
        .order("win_rate", { ascending: false });

      if (error) throw error;
      return (data ?? []) as UserWinStatsRow[];
    },
    staleTime: 1000 * 60, // 1분
  });
};
