import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/src/shared";
import { UpdateInquiryAnswerQueryModel } from "../model/types/api";

export const inquiryKeys = {
  all: ["inquiries"] as const,
  lists: () => [...inquiryKeys.all, "list"] as const,
  adminList: () => [...inquiryKeys.lists(), "admin"] as const,
} as const;

export const useGetAllInquiries = () => {
  return useQuery({
    queryKey: inquiryKeys.adminList(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("id, user_id, title, content, answer, admin_answer_at, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useUpdateInquiryAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: UpdateInquiryAnswerQueryModel) => {
      const { error } = await supabase
        .from("inquiries")
        .update({
          answer: req.body.answer,
          admin_answer_at: new Date().toISOString(),
        })
        .eq("id", req.query.inquiryId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inquiryKeys.all });
    },
  });
};
