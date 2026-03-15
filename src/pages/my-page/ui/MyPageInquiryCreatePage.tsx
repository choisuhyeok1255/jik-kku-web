"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { toast } from "sonner";
import { useAuthStore, useCreateInquiry } from "@/src/entities";
import { Header, LabelContent } from "@/src/shared";

const MyPageInquiryCreatePage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { mutate: createInquiry } = useCreateInquiry();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!user?.id) return;
    if (!title.trim()) {
      toast.error("제목을 입력해 주세요.");
      return;
    }
    if (!content.trim()) {
      toast.error("문의 내용을 입력해 주세요.");
      return;
    }

    createInquiry(
      {
        body: {
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
        },
      },
      {
        onSuccess: () => {
          toast.success("문의가 등록되었습니다.");
          router.push("/my-page/inquiry");
        },
        onError: () => {
          toast.error("문의 등록에 실패했습니다.");
        },
      },
    );
  };

  return (
    <div className="flex h-dvh flex-col">
      <Header
        className="mb-[20px] shrink-0"
        title={{ text: "문의 작성", position: "center" }}
        prevPage={{ href: "/my-page/inquiry" }}
      />
      <div className="flex flex-1 flex-col gap-[20px] overflow-y-auto px-[16px] pb-[24px]">
        <LabelContent label="제목" isRequired>
          <input
            placeholder="제목을 입력해 주세요."
            className="w-full rounded-[20px] border border-white/10 bg-[#ffffff]/4 p-[14px] text-[14px] text-[#ffffff] placeholder:text-white/40"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </LabelContent>
        <LabelContent label="문의 내용" isRequired>
          <textarea
            placeholder="문의 내용을 입력해 주세요."
            rows={8}
            className="w-full resize-none rounded-[20px] border border-white/10 bg-[#ffffff]/4 p-[14px] text-[14px] text-[#ffffff] placeholder:text-white/40"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </LabelContent>
        <div className="mt-auto px-[4px]">
          <button
            type="button"
            className="h-[56px] w-full rounded-[20px] bg-[#5724F0] text-[16px] font-bold text-white"
            onClick={handleSubmit}
          >
            문의 등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPageInquiryCreatePage;
