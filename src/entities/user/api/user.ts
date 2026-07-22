import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/shared";
import { GetUsersByIdsQueryModel, UserNicknameModel } from "../model/types/api";

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
