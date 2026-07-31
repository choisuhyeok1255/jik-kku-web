"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  useCreateNotice,
  useGetNoticeById,
  useUpdateNotice,
} from "@/src/entities";
import { Header } from "@/src/shared";

interface NoticeFormPageProps {
  mode: "create" | "edit";
  /** `mode === "edit"`일 때만 의미가 있습니다. */
  noticeId?: number;
}

/**
 * 공지사항 작성/수정 공용 페이지.
 * - `mode`가 "edit"이면 `noticeId`로 기존 데이터를 불러와 초기값을 채웁니다.
 * - 저장 성공 시 목록(`/admin/notices`)으로 이동합니다.
 */
const NoticeFormPage = ({ mode, noticeId }: NoticeFormPageProps) => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (value: string) => setTitle(value);
  const handleContentChange = (value: string) => setContent(value);

  const { mutateAsync: createNotice } = useCreateNotice();
  const { mutateAsync: updateNotice } = useUpdateNotice();

  // 수정 모드에서만 단건 조회. noticeId가 없거나 잘못되면 enabled=false로 막힙니다.
  const {
    data: existingNotice,
    isLoading: isLoadingExisting,
    isError: isExistingError,
  } = useGetNoticeById({
    query: { noticeId: noticeId ?? -1 },
  });

  const isEditMode = mode === "edit";
  const pageTitle = isEditMode ? "공지사항 수정" : "공지사항 작성";
  const submitLabel = isEditMode ? "수정 완료" : "공지 등록";

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      toast.error("제목을 입력해 주세요.");
      return;
    }
    if (!trimmedContent) {
      toast.error("내용을 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && noticeId != null) {
        await updateNotice({
          query: { noticeId },
          body: { title: trimmedTitle, content: trimmedContent },
        });
        toast.success("공지사항이 수정되었습니다.");
      } else {
        await createNotice({
          body: { title: trimmedTitle, content: trimmedContent },
        });
        toast.success("공지사항이 등록되었습니다.");
      }
      // 성공 후 목록으로 이동. router.back() 대신 명시적 push로 히스토리를 단순화합니다.
      router.push("/admin/notices");
    } catch {
      toast.error(
        isEditMode
          ? "공지사항 수정에 실패했습니다."
          : "공지사항 등록에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/notices");
  };

  // 수정 모드에서 기존 데이터가 도착하면 한 번만 폼 초기값으로 채웁니다.
  // 의존성에 existingNotice.id만 두어, 사용자가 수정 중에 refetch가 와도 입력을 덮어쓰지 않도록 합니다.
  useEffect(() => {
    if (!isEditMode) return;
    if (!existingNotice) return;
    setTitle(existingNotice.title);
    setContent(existingNotice.content);
  }, [isEditMode, existingNotice?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isEditMode && isLoadingExisting) {
    return (
      <div className="flex h-dvh flex-col">
        <Header
          className="mb-[12px] shrink-0"
          title={{ text: pageTitle, position: "left" }}
          prevPage={{ href: "/admin/notices" }}
        />
        <div className="flex flex-1 items-center justify-center">
          <span className="text-white/60">로딩 중...</span>
        </div>
      </div>
    );
  }

  if (isEditMode && (isExistingError || !existingNotice)) {
    return (
      <div className="flex h-dvh flex-col">
        <Header
          className="mb-[12px] shrink-0"
          title={{ text: pageTitle, position: "left" }}
          prevPage={{ href: "/admin/notices" }}
        />
        <div className="flex flex-1 items-center justify-center">
          <span className="text-white/60">공지사항을 불러오지 못했습니다.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col">
      <Header
        className="mb-[12px] shrink-0"
        title={{ text: pageTitle, position: "left" }}
        prevPage={{ href: "/admin/notices" }}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-[16px] overflow-y-auto px-[16px] pb-[24px]">
        <section className="rounded-[20px] border border-white/10 bg-white/4 p-[20px]">
          <label className="mb-[8px] block text-[14px] font-medium text-white/80">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="공지 제목을 입력하세요."
            disabled={isSubmitting}
            className="h-[44px] w-full rounded-[12px] border border-white/10 bg-white/4 px-[14px] text-[14px] text-white placeholder:text-white/40 disabled:opacity-60"
          />
        </section>

        <section className="rounded-[20px] border border-white/10 bg-white/4 p-[20px]">
          <label className="mb-[8px] block text-[14px] font-medium text-white/80">
            내용
          </label>
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="공지 내용을 입력하세요. (줄바꿈이 그대로 앱에 표시됩니다)"
            rows={14}
            disabled={isSubmitting}
            className="w-full resize-y rounded-[12px] border border-white/10 bg-white/4 p-[14px] text-[14px] leading-relaxed text-white placeholder:text-white/40 disabled:opacity-60"
          />
          <p className="mt-[8px] text-[12px] text-white/50">
            마크다운은 지원하지 않습니다. 줄바꿈만 그대로 반영됩니다.
          </p>
        </section>

        <div className="flex flex-wrap items-center gap-[12px]">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-[44px] min-w-[140px] rounded-[12px] bg-[#5724F0] px-[20px] text-[14px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "저장 중..." : submitLabel}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="h-[44px] min-w-[100px] rounded-[12px] border border-white/15 bg-white/4 px-[20px] text-[14px] font-medium text-white/85 transition-opacity hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeFormPage;
