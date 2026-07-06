import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/src/shared";

import { normalizeChecklistLabel } from "../lib/normalizeLabel";
import {
  ChecklistItemServerModel,
  CreateOfficialChecklistItemQueryModel,
  DeleteChecklistItemQueryModel,
  PromoteChecklistItemQueryModel,
  UpdateChecklistItemLabelQueryModel,
} from "../model/types/api";

/** 준비물 항목 관련 react-query 키 스코프. */
export const checklistItemKeys = {
  all: ["checklist_items"] as const,
  lists: () => [...checklistItemKeys.all, "list"] as const,
  list: () => [...checklistItemKeys.lists()] as const,
} as const;

/** 준비물 항목 전체 조회 (커스텀(unofficial) 항목이 먼저, 각 그룹은 이름순). */
export const useGetChecklistItems = () => {
  return useQuery({
    queryKey: checklistItemKeys.list(),
    queryFn: async (): Promise<ChecklistItemServerModel[]> => {
      const { data, error } = await supabase
        .from("checklist_items")
        .select("*")
        .order("kind", { ascending: false })
        .order("label", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
  });
};

/** 추천(official) 항목 추가. `normalized_label`은 label에서 계산해 함께 저장. */
export const useCreateOfficialChecklistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: CreateOfficialChecklistItemQueryModel) => {
      const label = req.body.label.trim();
      const { error } = await supabase.from("checklist_items").insert({
        label,
        normalized_label: normalizeChecklistLabel(label),
        kind: "official",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checklistItemKeys.lists() });
    },
  });
};

/** 항목 이름(label) 수정. label 변경에 맞춰 normalized_label도 갱신. */
export const useUpdateChecklistItemLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: UpdateChecklistItemLabelQueryModel) => {
      const label = req.body.label.trim();
      const { error } = await supabase
        .from("checklist_items")
        .update({ label, normalized_label: normalizeChecklistLabel(label) })
        .eq("id", req.query.itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checklistItemKeys.lists() });
    },
  });
};

/**
 * unofficial 항목을 official(추천)로 승격.
 * 같은 이름 중복 항목 병합까지 `promote_checklist_item` RPC로 원자 처리한다
 * (기존 official로 합치거나 대상을 승격 → 다른 중복들의 유저 기록 이전 → 중복 삭제).
 */
export const usePromoteChecklistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: PromoteChecklistItemQueryModel) => {
      const { error } = await supabase.rpc("promote_checklist_item", {
        target_id: req.query.itemId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checklistItemKeys.lists() });
    },
  });
};

/** 항목 물리 삭제. 유저가 담은 항목이면 FK 제약으로 실패할 수 있음. */
export const useDeleteChecklistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: DeleteChecklistItemQueryModel) => {
      const { error } = await supabase
        .from("checklist_items")
        .delete()
        .eq("id", req.query.itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checklistItemKeys.all });
    },
  });
};
