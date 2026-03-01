import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/src/shared";
import {
  CreateInquiryQueryModel,
  GetMyInquiriesQueryModel,
  UpdateInquiryAnswerQueryModel,
} from "../model/types/api";

export const inquiryKeys = {
  all: ["inquiries"] as const,
  lists: () => [...inquiryKeys.all, "list"] as const,
  myList: (userId: string) => [...inquiryKeys.lists(), "my", userId] as const,
  adminList: () => [...inquiryKeys.lists(), "admin"] as const,
} as const;

export const useGetMyInquiries = (req: GetMyInquiriesQueryModel) => {
  return useQuery({
    queryKey: inquiryKeys.myList(req.query.userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("id, title, content, answer, admin_answer_at, created_at")
        .eq("user_id", req.query.userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!req.query.userId,
  });
};

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

export const useCreateInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: CreateInquiryQueryModel) => {
      const { error } = await supabase.from("inquiries").insert(req.body);
      if (error) throw error;
    },
    onSuccess: (_, req) => {
      queryClient.invalidateQueries({
        queryKey: inquiryKeys.myList(req.body.user_id),
      });
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
