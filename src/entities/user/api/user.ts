import { supabase } from "@/src/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UpdateNicknameQueryModel, UserServerModel } from "../model/types/api";

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

export const useUpdateNickname = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: UpdateNicknameQueryModel) => {
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
