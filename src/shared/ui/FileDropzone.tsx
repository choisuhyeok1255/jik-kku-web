"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { cn } from "@/src/shared/lib/tailwind";

const FileDropzone = ({
  onChange,
  className,
}: {
  onChange: (files: FileList | null) => void;
  className?: string;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        // FileList를 생성하여 react-hook-form에 전달
        const fileList = new DataTransfer();
        fileList.items.add(file);
        onChange(fileList.files);

        // 이미지 미리보기 URL 생성
        const url = URL.createObjectURL(file);
        setImageUrl(url);
      }
    },
  });

  const handleDelete = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
      onChange(null);
    }
  };

  if (imageUrl) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-[20px] border border-[#FFFFFF]/10",
          className,
        )}
      >
        <Image
          src={imageUrl}
          alt="미리보기"
          width={500}
          height={500}
          className="h-full w-full object-contain"
        />
        <button
          type="button"
          onClick={handleDelete}
          className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-lg font-bold text-white hover:bg-black/70"
        >
          x
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-[20px] border border-[#FFFFFF]/10",
        isDragActive && "border-primary bg-muted",
        className,
      )}
    >
      <input {...getInputProps()} />
      <p className="text-center text-[14px] text-white/40">
        경기 사진, 인증샷 등 다양한
        <br /> 사진을 업로드해보세요
      </p>
    </div>
  );
};

export default FileDropzone;
