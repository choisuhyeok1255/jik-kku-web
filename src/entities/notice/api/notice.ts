import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/src/shared";
import {
  CreateNoticeQueryModel,
  DeleteNoticeQueryModel,
  GetNoticeByIdQueryModel,
  UpdateNoticeQueryModel,
} from "../model/types/api";

/** 공지사항 관련 react-query 키 스코프. 목록/단건을 계층적으로 구분합니다. */
export const noticeKeys = {
  all: ["notices"] as const,
  lists: () => [...noticeKeys.all, "list"] as const,
  list: () => [...noticeKeys.lists()] as const,
  details: () => [...noticeKeys.all, "detail"] as const,
  detail: (noticeId: number) => [...noticeKeys.details(), noticeId] as const,
} as const;

/** 공지 전체 목록을 최신순으로 조회합니다. 어드민 목록 화면에서 사용합니다. */
export const useGetAllNotices = () => {
  return useQuery({
    queryKey: noticeKeys.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notices")
        .select("id, title, content, created_at, updated_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
};

/** 공지 단건 조회. 수정 페이지 초기값 세팅용입니다. */
export const useGetNoticeById = (req: GetNoticeByIdQueryModel) => {
  return useQuery({
    queryKey: noticeKeys.detail(req.query.noticeId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notices")
        .select("id, title, content, created_at, updated_at")
        .eq("id", req.query.noticeId)
        .single();

      if (error) throw error;
      return data;
    },
    // 0 이하 id가 들어오면 쿼리 실행을 막습니다.
    enabled: Number.isFinite(req.query.noticeId) && req.query.noticeId > 0,
  });
};

/** 공지 작성. 작성 성공 시 react-query 목록 캐시를 무효화합니다. */
export const useCreateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: CreateNoticeQueryModel) => {
      const { error } = await supabase.from("notices").insert(req.body);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
    },
  });
};

/** 공지 수정. 단건 상세 캐시와 목록 캐시 모두 무효화합니다. */
export const useUpdateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: UpdateNoticeQueryModel) => {
      const { error } = await supabase
        .from("notices")
        .update({
          title: req.body.title,
          content: req.body.content,
        })
        .eq("id", req.query.noticeId);

      if (error) throw error;
    },
    onSuccess: (_, req) => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: noticeKeys.detail(req.query.noticeId),
      });
    },
  });
};

/** 공지 물리 삭제. 복구 정책이 없으므로 호출 전 UI에서 재확인이 필요합니다. */
export const useDeleteNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: DeleteNoticeQueryModel) => {
      const { error } = await supabase
        .from("notices")
        .delete()
        .eq("id", req.query.noticeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.all });
    },
  });
};
