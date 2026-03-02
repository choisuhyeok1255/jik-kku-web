import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/src/shared";
import type { UserWinStatsRow } from "../model/types/api";

export type UserWinStatsSummaryRow = {
  user_id: string;
  wins: number;
  total: number;
};

export type RankingSortBy = "win_rate" | "total_games";

export const userWinStatsKeys = {
  all: ["user_win_stats"] as const,
  ranking: (sortBy?: RankingSortBy) =>
    [...userWinStatsKeys.all, "ranking", sortBy ?? "win_rate"] as const,
  /** 랭킹 전체 무효화용 (승률/경기수 정렬 모두) */
  rankingAll: () => [...userWinStatsKeys.all, "ranking"] as const,
  summary: (userId: string) => [...userWinStatsKeys.all, "summary", userId] as const,
} as const;

export const getUserWinStatsRanking = async (
  sortBy: RankingSortBy = "win_rate",
) => {
  const orderColumn = sortBy === "total_games" ? "total_games" : "win_rate";

  const { data, error } = await supabase
    .from("user_win_stats")
    .select("*")
    .order(orderColumn, { ascending: false });

  if (error) throw error;
  return (data ?? []) as UserWinStatsRow[];
};

/** 직관 랭킹 조회 (승률순 / 직관 경기수 순) */
export const useGetUserWinStatsRanking = ({
  sortBy = "win_rate",
  initialData,
}: {
  sortBy?: RankingSortBy;
  initialData?: UserWinStatsRow[];
}) => {
  return useQuery({
    queryKey: userWinStatsKeys.ranking(sortBy),
    queryFn: () => getUserWinStatsRanking(sortBy),
    staleTime: 1000 * 60, // 1분
    initialData,
  });
};

export const getUserWinStatsSummary = async (
  userId: string,
): Promise<UserWinStatsSummaryRow | null> => {
  const { data, error } = await supabase
    .from("user_win_stats_summary")
    .select("user_id, wins, total")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // no rows
    throw error;
  }
  return data as UserWinStatsSummaryRow;
};

/** 직관 승률 요약 조회 (홈/추가 버튼용) */
export const useGetUserWinStatsSummary = (userId: string) => {
  return useQuery({
    queryKey: userWinStatsKeys.summary(userId),
    queryFn: () => getUserWinStatsSummary(userId),
    enabled: !!userId,
  });
};
