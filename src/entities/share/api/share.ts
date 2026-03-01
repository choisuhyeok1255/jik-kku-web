import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/src/shared";
import {
  CreateShareQueryModel,
  DeleteShareQueryModel,
  GetShareDetailQueryModel,
  ShareServerModel,
  UpdateShareAttendeesQueryModel,
  UpdateShareQueryModel,
} from "../model/types/api";

export const shareKeys = {
  all: ["share"] as const,
  lists: () => [...shareKeys.all, "list"] as const,
  list: () => [...shareKeys.lists()] as const,
  details: () => [...shareKeys.all, "detail"] as const,
  detail: (req: GetShareDetailQueryModel) =>
    [...shareKeys.details(), req.query.shareId] as const,
} as const;

export const getShareDetail = async (shareId: number) => {
  const { data, error } = await supabase
    .from("share")
    .select("id, title, content, created_at")
    .eq("id", shareId)
    .single();

  if (error) throw error;
  return data as ShareServerModel | null;
};

export const getShares = async () => {
  const { data, error } = await supabase
    .from("share")
    .select(
      "id, user_id, title, content, deadline, stadium_id, max_attendees, attendee_user_ids, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ShareServerModel[];
};

export const useGetShares = ({
  initialData,
}: {
  initialData?: ShareServerModel[];
}) => {
  return useQuery({
    queryKey: shareKeys.list(),
    queryFn: getShares,
    initialData: initialData,
  });
};

export const useGetShareDetail = (req: GetShareDetailQueryModel) => {
  return useQuery({
    queryKey: shareKeys.detail(req),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("share")
        .select(
          "id, user_id, title, content, deadline, stadium_id, max_attendees, attendee_user_ids, created_at",
        )
        .eq("id", req.query.shareId)
        .single();

      if (error) throw error;
      return data as ShareServerModel;
    },
    enabled: !!req.query.shareId,
  });
};

export const useUpdateShareAttendees = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: UpdateShareAttendeesQueryModel) => {
      const { error } = await supabase
        .from("share")
        .update({ attendee_user_ids: req.body.attendee_user_ids })
        .eq("id", req.query.shareId);

      if (error) throw error;
    },
    onSuccess: (_, req) => {
      queryClient.invalidateQueries({ queryKey: shareKeys.all });
      queryClient.invalidateQueries({
        queryKey: shareKeys.detail({ query: { shareId: req.query.shareId } }),
      });
    },
  });
};

export const useUpdateShare = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: UpdateShareQueryModel) => {
      const { error } = await supabase
        .from("share")
        .update(req.body)
        .eq("id", req.query.shareId);

      if (error) throw error;
    },
    onSuccess: (_, req) => {
      queryClient.invalidateQueries({ queryKey: shareKeys.all });
      queryClient.invalidateQueries({
        queryKey: shareKeys.detail({ query: { shareId: req.query.shareId } }),
      });
    },
  });
};

export const usePostShare = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: CreateShareQueryModel) => {
      const { error } = await supabase.from("share").insert(req.body);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shareKeys.all });
    },
  });
};

export const useDeleteShare = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: DeleteShareQueryModel) => {
      const { error } = await supabase
        .from("share")
        .delete()
        .eq("id", req.query.shareId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shareKeys.all });
    },
  });
};
