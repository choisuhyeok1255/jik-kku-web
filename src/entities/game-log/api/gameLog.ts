import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { supabase } from "@/src/shared";
import {
  CertifyGameLogQueryModel,
  CreateGameLogQueryModel,
  GetGameLogsInfiniteQueryModel,
  GetGameLogsQueryModel,
  GetCertifyGameLogsQueryModel,
  UpdateGameLogQueryModel,
  GetGameLogDetailQueryModel,
  DeleteGameLogQueryModel,
} from "../model/types/api";

export const GAME_LOGS_PAGE_SIZE = 10;

// 쿼리 키 팩토리
export const gameLogKeys = {
  all: ["game_logs"] as const,
  lists: () => [...gameLogKeys.all, "list"] as const,
  list: (req: GetGameLogsQueryModel) => [...gameLogKeys.lists(), req] as const,
  listsInfinite: () => [...gameLogKeys.all, "listInfinite"] as const,
  listInfinite: (req: GetGameLogsInfiniteQueryModel) =>
    [...gameLogKeys.listsInfinite(), req] as const,
  notCertified: () => [...gameLogKeys.all, "not_certified"] as const,
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
          "id, home_team_id, away_team_id, home_team_score, away_team_score, match_date, note, game_log_image, game_log_image_thumbnail, is_certified, stadium_id",
        )
        .eq("user_id", req.query.userId)
        .order("match_date", { ascending: false })
        .order("created_at", { ascending: false }); // match_date 최신순, 동일 시 생성순 최신

      if (error) throw error;
      return data || [];
    },
    enabled: !!req?.query?.userId, // userId가 있을 때만 실행
  });
};

export const useGetGameLogsInfinite = (req: GetGameLogsInfiniteQueryModel) => {
  const pageSize = req.query.pageSize ?? GAME_LOGS_PAGE_SIZE;

  return useInfiniteQuery({
    queryKey: gameLogKeys.listInfinite(req),
    queryFn: async ({ pageParam }) => {
      if (!req.query.userId) return [];

      const from = pageParam * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await supabase
        .from("game_logs")
        .select(
          "id, home_team_id, away_team_id, home_team_score, away_team_score, match_date, note, game_log_image, game_log_image_thumbnail, is_certified, is_admin_certified, stadium_id, youtube_url",
        )
        .eq("user_id", req.query.userId)
        .order("match_date", { ascending: false })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return data || [];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < pageSize) return undefined;
      return allPages.length;
    },
    enabled: !!req?.query?.userId,
  });
};

export const useGetNotCertifyGameLogs = () => {
  return useQuery({
    queryKey: gameLogKeys.notCertified(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("game_logs")
        .select("id, match_date, game_log_image, game_log_image_thumbnail")
        .eq("is_admin_certified", false)
        .eq("is_certified", true)
        .not("game_log_image", "is", null)
        .order("match_date", { ascending: false }); // match_date 최신순 정렬

      if (error) throw error;
      return data || [];
    },
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
          "id, home_team_id, away_team_id, home_team_score, away_team_score, weather, match_date, companion, mvp, note, is_certified",
        )
        .eq("user_id", req.query.userId)
        .eq("is_certified", true)
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
      const { error } = await supabase.from("game_logs").insert(req.body);
      if (error) throw error;
    },
    onSuccess: (_, req) => {
      if (!req.body.user_id) return;

      queryClient.invalidateQueries({
        queryKey: gameLogKeys.list({ query: { userId: req.body.user_id } }),
      });
      queryClient.invalidateQueries({
        queryKey: gameLogKeys.listsInfinite(),
      });
      queryClient.invalidateQueries({ queryKey: ["user_win_stats"] });
    },
  });
};

export const useDeleteGameLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: DeleteGameLogQueryModel) => {
      const { error } = await supabase
        .from("game_logs")
        .delete()
        .eq("id", req.query.gameLogId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gameLogKeys.all });
      queryClient.invalidateQueries({
        queryKey: gameLogKeys.listsInfinite(),
      });
      queryClient.invalidateQueries({ queryKey: ["user_win_stats"] });
    },
  });
};

export const useGetGameLogDetail = (req: GetGameLogDetailQueryModel) => {
  return useQuery({
    queryKey: gameLogKeys.detail(req),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("game_logs")
        .select("*")
        .eq("id", req.query.gameLogId)
        .single();

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateGameLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: UpdateGameLogQueryModel) => {
      const { error } = await supabase
        .from("game_logs")
        .update(req.body)
        .eq("id", req.query.gameLogId);
      if (error) throw error;
    },
    onSuccess: (_, gameLog) => {
      if (!gameLog.body.user_id) return;

      queryClient.invalidateQueries({
        queryKey: gameLogKeys.list({ query: { userId: gameLog.body.user_id } }),
      });
      queryClient.invalidateQueries({
        queryKey: gameLogKeys.listsInfinite(),
      });
      queryClient.invalidateQueries({
        queryKey: gameLogKeys.detail({
          query: { gameLogId: gameLog.query.gameLogId },
        }),
      });
      queryClient.invalidateQueries({ queryKey: ["user_win_stats"] });
    },
  });
};

export const useCertifyGameLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: CertifyGameLogQueryModel) => {
      const { error } = await supabase
        .from("game_logs")
        .update({ is_admin_certified: true })
        .eq("id", req.query.gameLogId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gameLogKeys.all });
      queryClient.invalidateQueries({
        queryKey: gameLogKeys.listsInfinite(),
      });
      queryClient.invalidateQueries({ queryKey: ["user_win_stats"] });
    },
  });
};

export const useRejectGameLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: CertifyGameLogQueryModel) => {
      const { error } = await supabase
        .from("game_logs")
        .update({ is_certified: false, is_admin_certified: false })
        .eq("id", req.query.gameLogId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gameLogKeys.all });
      queryClient.invalidateQueries({
        queryKey: gameLogKeys.listsInfinite(),
      });
      queryClient.invalidateQueries({ queryKey: ["user_win_stats"] });
    },
  });
};
