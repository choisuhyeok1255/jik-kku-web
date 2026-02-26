import { useMutation } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { GetSignedUrlQueryModel, UploadFileQueryModel } from "./file.types";

export const useUploadFile = () => {
  return useMutation({
    mutationFn: async ({ bucket, file, userId }: UploadFileQueryModel) => {
      // 파일명 정리: 한글, 공백, 특수문자 제거
      const fileExtension = file.name.split(".").pop();
      const sanitizedFileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}.${fileExtension}`;

      // 사용자 ID 폴더 경로 포함
      const filePath = `${userId}/${sanitizedFileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) throw error;
      return data;
    },
  });
};

export const useGetSignedUrl = () => {
  return useMutation({
    mutationFn: async ({ bucket, path }: GetSignedUrlQueryModel) => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 60);
      if (error) throw error;
      return data;
    },
  });
};
