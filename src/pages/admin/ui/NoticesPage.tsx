"use client";

import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useDeleteNotice, useGetAllNotices } from "@/src/entities";
import { Header } from "@/src/shared";

/** 공지사항 카드 스타일. inquiries/game-logs 어드민과 동일한 다크 카드 톤. */
const CARD_BASE =
  "rounded-[20px] border border-white/10 bg-white/[0.04] p-[20px]";

/**
 * 어드민 공지사항 목록 페이지.
 * - 상단 헤더 우측에 "새 공지 작성" 링크를 둡니다.
 * - 카드마다 [수정] [삭제] 버튼을 제공하며, 삭제는 window.confirm 이후 실행됩니다.
 */
const NoticesPage = () => {
  const router = useRouter();

  const { data: notices = [], isLoading } = useGetAllNotices();
  const { mutateAsync: deleteNotice, isPending: isDeleting } =
    useDeleteNotice();

  const handleEdit = (noticeId: number) => {
    router.push(`/admin/notices/${noticeId}`);
  };

  const handleDelete = async (noticeId: number, title: string) => {
    // 복구 정책이 없으므로 파괴적 동작 전에 한 번 더 확인합니다.
    const ok = window.confirm(
      `"${title}" 공지를 삭제하시겠어요?\n삭제하면 복구할 수 없습니다.`,
    );
    if (!ok) return;

    try {
      await deleteNotice({ query: { noticeId } });
      toast.success("공지사항이 삭제되었습니다.");
    } catch {
      toast.error("공지사항 삭제에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-dvh flex-col">
        <Header
          className="mb-[12px] shrink-0"
          title={{ text: "공지사항 관리", position: "left" }}
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
        title={{ text: "공지사항 관리", position: "left" }}
        prevPage={{ href: "/admin" }}
        rightAction={
          <Link
            href="/admin/notices/new"
            className="rounded-[12px] bg-[#5724F0] px-[14px] py-[8px] text-[13px] font-bold text-white transition-opacity hover:opacity-90"
          >
            새 공지 작성
          </Link>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col gap-[16px] overflow-y-auto px-[16px] pb-[24px]">
        {notices.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-white/60">등록된 공지사항이 없습니다.</span>
          </div>
        ) : (
          notices.map((notice) => (
            <article key={notice.id} className={CARD_BASE}>
              <div className="mb-[12px] flex flex-wrap items-start justify-between gap-[12px]">
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-[16px] font-bold text-white">
                    {notice.title}
                  </h2>
                  <div className="mt-[4px] flex flex-wrap items-center gap-[8px] text-[13px] text-white/60">
                    <span>
                      작성{" "}
                      {dayjs(notice.created_at).format("YYYY-MM-DD HH:mm")}
                    </span>
                    {/* 생성 이후 수정이 있었을 때만 수정 시각을 덧붙입니다. */}
                    {notice.updated_at &&
                      notice.updated_at !== notice.created_at && (
                        <>
                          <span>·</span>
                          <span>
                            수정{" "}
                            {dayjs(notice.updated_at).format(
                              "YYYY-MM-DD HH:mm",
                            )}
                          </span>
                        </>
                      )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-[8px]">
                  <button
                    type="button"
                    onClick={() => handleEdit(notice.id)}
                    className="h-[36px] rounded-[10px] border border-white/15 bg-white/6 px-[14px] text-[13px] font-medium text-white/90 transition-opacity hover:bg-white/12"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(notice.id, notice.title)}
                    disabled={isDeleting}
                    className="h-[36px] rounded-[10px] bg-red-600/90 px-[14px] text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    삭제
                  </button>
                </div>
              </div>

              <p className="text-[14px] leading-relaxed whitespace-pre-wrap text-white/90">
                {notice.content}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default NoticesPage;
