import { supabase } from "@/src/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GetUsersByIdsQueryModel,
  UpdateNicknameQueryModel,
  UpdateTeamQueryModel,
  UserServerModel,
  UserNicknameModel,
} from "../model/types/api";

export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      return data as UserServerModel;
    },
  });
};

export const useGetUsersByIds = (req: GetUsersByIdsQueryModel) => {
  return useQuery({
    queryKey: ["users", req.query.userIds],
    queryFn: async () => {
      const { userIds } = req.query;
      if (!userIds.length) return [] as UserNicknameModel[];

      const { data, error } = await supabase
        .from("users")
        .select("id, nickname")
        .in("id", userIds);

      if (error) throw error;
      return (data ?? []) as UserNicknameModel[];
    },
    enabled: req.query.userIds.length > 0,
  });
};

export const useUpdateNickname = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: UpdateNicknameQueryModel) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("users")
        .update(req.body)
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: UpdateTeamQueryModel) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("users").update(req.body).eq("id", user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
