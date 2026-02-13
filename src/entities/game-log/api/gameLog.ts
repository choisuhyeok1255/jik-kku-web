import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/src/shared";
import {
  CertifyGameLogQueryModel,
  CreateGameLogQueryModel,
  GameLogServerModel,
  GetGameLogsQueryModel,
  GetNotCertifyGameLogsQueryModel,
  GetCertifyGameLogsQueryModel,
  UpdateGameLogQueryModel,
  GetGameLogDetailQueryModel,
  DeleteGameLogQueryModel,
  GetNotCertifyGameLogsServerModel,
  GetCertifyGameLogsServerModel,
} from "../model/types/api";

// 쿼리 키 팩토리
export const gameLogKeys = {
  all: ["game_logs"] as const,
  lists: () => [...gameLogKeys.all, "list"] as const,
  list: (req: GetGameLogsQueryModel) => [...gameLogKeys.lists(), req] as const,
  notCertified: (req: GetNotCertifyGameLogsQueryModel) =>
    [...gameLogKeys.all, "not_certified", req] as const,
  certify: (req: GetCertifyGameLogsQueryModel) =>
    [...gameLogKeys.all, "certify", req] as const,
  details: () => [...gameLogKeys.all, "detail"] as const,
  detail: (req: GetGameLogDetailQueryModel) =>
    [...gameLogKeys.details(), req] as const,
} as const;

export const useGetGameLogs = (req: GetGameLogsQueryModel) => {
  return useQuery({
    queryKey: gameLogKeys.list(req),
    queryFn: async () => {
      if (!req.query.userId) return;

      const { data, error } = await supabase
        .from("game_logs")
        .select(
          "id, home_team_id, away_team_id, home_team_score, away_team_score, weather, match_date, companion, mvp, note, game_log_image, is_certify",
        )
        .eq("user_id", req.query.userId)
        .order("match_date", { ascending: false }); // match_date 최신순 정렬

      if (error) throw error;
      return data || [];
    },
    enabled: !!req?.query?.userId, // userId가 있을 때만 실행
  });
};

export const useGetNotCertifyGameLogs = (
  req: GetNotCertifyGameLogsQueryModel,
) => {
  return useQuery({
    queryKey: gameLogKeys.notCertified(req),
    queryFn: async () => {
      if (!req.query.userId) {
        return [];
      }

      const { data, error } = await supabase
        .from("game_logs")
        .select("id, match_date, game_log_image")
        .eq("user_id", req.query.userId)
        .eq("is_certify", false)
        .not("game_log_image", "is", null)
        .order("match_date", { ascending: false }); // match_date 최신순 정렬

      if (error) throw error;
      return data || [];
    },
    enabled: !!req?.query?.userId, // userId가 있을 때만 실행
  });
};

export const useGetCertifyGameLogs = (req: GetCertifyGameLogsQueryModel) => {
  return useQuery({
    queryKey: gameLogKeys.certify(req),
    queryFn: async () => {
      if (!req.query.userId) {
        return [];
      }

      const { data, error } = await supabase
        .from("game_logs")
        .select(
          "id, home_team_id, away_team_id, home_team_score, away_team_score, weather, match_date, companion, mvp, note, is_certify",
        )
        .eq("user_id", req.query.userId)
        .eq("is_certify", true)
        .order("match_date", { ascending: false }); // match_date 최신순 정렬

      if (error) throw error;
      return data || [];
    },
    enabled: !!req?.query?.userId, // userId가 있을 때만 실행
  });
};

export const usePostGameLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: CreateGameLogQueryModel) => {
      await supabase.from("game_logs").insert(req.body);
    },
    onSuccess: (_, req) => {
      if (!req.body.user_id) return;

      queryClient.invalidateQueries({
        queryKey: gameLogKeys.list({ query: { userId: req.body.user_id } }),
      });
    },
  });
};

export const useDeleteGameLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: DeleteGameLogQueryModel) => {
      await supabase.from("game_logs").delete().eq("id", req.query.gameLogId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gameLogKeys.all });
    },
  });
};

export const useGetGameLogDetail = (req: GetGameLogDetailQueryModel) => {
  return useQuery({
    queryKey: gameLogKeys.detail(req),
    queryFn: async () => {
      const { data } = await supabase
        .from("game_logs")
        .select("*")
        .eq("id", req.query.gameLogId)
        .single();

      return data;
    },
  });
};

export const useUpdateGameLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: UpdateGameLogQueryModel) => {
      await supabase
        .from("game_logs")
        .update(req.body)
        .eq("id", req.query.gameLogId);
    },
    onSuccess: (_, gameLog) => {
      if (!gameLog.body.user_id) return;

      queryClient.invalidateQueries({
        queryKey: gameLogKeys.list({ query: { userId: gameLog.body.user_id } }),
      });
      queryClient.invalidateQueries({
        queryKey: gameLogKeys.detail({
          query: { gameLogId: gameLog.query.gameLogId },
        }),
      });
    },
  });
};

export const useCertifyGameLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: CertifyGameLogQueryModel) => {
      await supabase
        .from("game_logs")
        .update({ is_certify: true })
        .eq("id", req.query.gameLogId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gameLogKeys.all });
    },
  });
};
