"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import {
  getNicknameOrShortId,
  useGetAllInquiries,
  useGetUsersByIds,
  useUpdateInquiryAnswer,
} from "@/src/entities";
import { Header } from "@/src/shared";

const CARD_BASE =
  "rounded-[20px] border border-white/10 bg-white/[0.04] p-[20px]";

const InquiriesPage = () => {
  const { data: inquiries = [], isLoading } = useGetAllInquiries();
  const { mutateAsync: updateAnswer } = useUpdateInquiryAnswer();

  const userIds = [...new Set(inquiries.map((i) => i.user_id))];
  const { data: users = [] } = useGetUsersByIds({
    query: { userIds },
  });

  const getUserNickname = (userId: string) =>
    getNicknameOrShortId(userId, users.find((u) => u.id === userId)?.nickname);

  if (isLoading) {
    return (
      <div className="flex h-dvh flex-col">
        <Header
          className="mb-[12px] shrink-0"
          title={{ text: "문의 관리", position: "left" }}
          prevPage={{ href: "/admin" }}
        />
        <div className="flex flex-1 items-center justify-center">
          <span className="text-white/60">로딩 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col">
      <Header
        className="mb-[12px] shrink-0"
        title={{ text: "문의 관리", position: "left" }}
        prevPage={{ href: "/admin" }}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-[16px] overflow-y-auto px-[16px] pb-[24px]">
        {inquiries.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-white/60">등록된 문의가 없습니다.</span>
          </div>
        ) : (
          inquiries.map((inquiry) => (
            <InquiryCard
              key={inquiry.id}
              inquiry={inquiry}
              userNickname={getUserNickname(inquiry.user_id)}
              updateAnswer={updateAnswer}
            />
          ))
        )}
      </div>
    </div>
  );
};

const InquiryCard = ({
  inquiry,
  userNickname,
  updateAnswer,
}: {
  inquiry: {
    id: number;
    user_id: string;
    title: string;
    content: string;
    answer: string | null;
    admin_answer_at: string | null;
    created_at: string;
  };
  userNickname: string;
  updateAnswer: (req: {
    query: { inquiryId: number };
    body: { answer: string };
  }) => Promise<unknown>;
}) => {
  const [answer, setAnswer] = useState(inquiry.answer ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAnswer(inquiry.answer ?? "");
  }, [inquiry.answer]);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast.error("답변 내용을 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateAnswer({
        query: { inquiryId: inquiry.id },
        body: { answer: answer.trim() },
      });
      toast.success("답변이 등록되었습니다.");
    } catch {
      toast.error("답변 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={CARD_BASE}>
      <div className="mb-[12px] flex items-center justify-between gap-[8px]">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[16px] font-bold text-[#ffffff]">
            {inquiry.title}
          </div>
          <div className="mt-[4px] flex flex-wrap items-center gap-[8px] text-[14px] text-white/60">
            <span>{userNickname}</span>
            <span>·</span>
            <span>{dayjs(inquiry.created_at).format("YYYY-MM-DD HH:mm")}</span>
          </div>
        </div>
        {inquiry.answer && (
          <span className="shrink-0 rounded-[8px] bg-[#C6E90033] px-[8px] py-[4px] text-[12px] font-medium text-[#C6E900]">
            답변 완료
          </span>
        )}
      </div>

      <p className="mb-[16px] text-[14px] leading-relaxed whitespace-pre-wrap text-white/90">
        {inquiry.content}
      </p>

      <div className="border-t border-white/10 pt-[16px]">
        <label className="mb-[8px] block text-[14px] font-medium text-white/80">
          관리자 답변
        </label>
        <textarea
          placeholder="답변을 입력해 주세요."
          rows={4}
          className="mb-[12px] w-full resize-none rounded-[12px] border border-white/10 bg-[#ffffff]/4 p-[12px] text-[14px] text-[#ffffff] placeholder:text-white/40"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={isSubmitting}
        />
        <button
          type="button"
          className="h-[44px] w-full rounded-[12px] bg-[#5724F0] text-[14px] font-bold text-white disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "등록 중..." : "답변 등록"}
        </button>
      </div>
    </div>
  );
};

export default InquiriesPage;
