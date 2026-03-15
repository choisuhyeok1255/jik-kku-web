"use client";

import dayjs from "dayjs";

import { useAuthStore, useGetMyInquiries } from "@/src/entities";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Header,
  NotLogin,
} from "@/src/shared";

const CARD_BASE =
  "rounded-[20px] border border-white/10 bg-white/[0.04] p-[20px]";

const MyPageInquiryPage = () => {
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const { data: inquiries = [], isLoading: isInquiriesLoading } =
    useGetMyInquiries({
      query: { userId: user?.id ?? "" },
    });

  if (isAuthLoading || isInquiriesLoading) {
    return (
      <div className="flex h-dvh flex-col">
        <div className="flex flex-1 items-center justify-center">
          <span className="text-white/60">로딩 중...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <NotLogin />;
  }

  return (
    <div className="flex h-dvh flex-col">
      <Header
        className="mb-[12px] shrink-0"
        title={{ text: "문의사항", position: "center" }}
        prevPage={{ href: "/my-page" }}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-[12px] overflow-y-auto px-[16px] pb-[150px]">
        {inquiries.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-[8px]">
            <span className="text-center text-white/60">
              문의 내역이 없습니다.
            </span>
            <span className="text-center text-[14px] text-white/40">
              새 문의를 작성해 주세요.
            </span>
          </div>
        ) : (
          <Accordion type="multiple" className="flex flex-col gap-[12px]">
            {inquiries.map((inquiry) => (
              <AccordionItem
                key={inquiry.id}
                value={String(inquiry.id)}
                className={`${CARD_BASE} border-0 p-0`}
              >
                <AccordionTrigger className="rounded-[20px] px-[20px] py-[20px] hover:no-underline [&[data-state=open]>svg]:rotate-180">
                  <div className="flex flex-1 items-start justify-between gap-[12px] text-left">
                    <div className="min-w-0 flex-1">
                      <div className="mb-[4px] truncate text-[16px] font-bold text-[#ffffff]">
                        {inquiry.title}
                      </div>
                      <div className="flex items-center justify-between gap-[8px]">
                        <span className="text-[14px] text-white/60">
                          {dayjs(inquiry.created_at).format("YYYY-MM-DD HH:mm")}
                        </span>
                        <span
                          className={`shrink-0 rounded-[8px] px-[8px] py-[4px] text-[12px] font-medium ${
                            inquiry.answer
                              ? "bg-[#C6E90033] text-[#C6E900]"
                              : "bg-white/10 text-white"
                          }`}
                        >
                          {inquiry.answer ? "답변 완료" : "답변 대기 중"}
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-[20px] pt-0 pb-[20px]">
                  <div className="border-t border-white/10 pt-[16px]">
                    <div className="mb-[12px]">
                      <span className="text-[12px] font-medium text-white/50">
                        문의 내용
                      </span>
                      <p className="mt-[8px] text-[14px] leading-relaxed whitespace-pre-wrap text-white/90">
                        {inquiry.content}
                      </p>
                    </div>
                    <div className="rounded-[12px] border border-white/10 bg-white/2 p-[16px]">
                      <div className="flex items-center justify-between gap-[8px]">
                        <span className="text-[12px] font-medium text-white/50">
                          답변
                        </span>
                        {inquiry.answer && inquiry.admin_answer_at && (
                          <span className="text-[12px] text-white/50">
                            {dayjs(inquiry.admin_answer_at).format(
                              "YYYY-MM-DD HH:mm",
                            )}
                          </span>
                        )}
                      </div>
                      {inquiry.answer ? (
                        <p className="mt-[8px] text-[14px] leading-relaxed whitespace-pre-wrap text-white/90">
                          {inquiry.answer}
                        </p>
                      ) : (
                        <p className="mt-[8px] text-[14px] text-white/60">
                          답변 대기 중입니다. 빠른 시일 내에 답변 드리겠습니다.
                        </p>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default MyPageInquiryPage;
