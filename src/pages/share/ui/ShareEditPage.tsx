"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useMemo } from "react";

import { toast } from "sonner";
import { ShareForm, transformApiToShareForm } from "@/src/features";
import {
  useAuthStore,
  useDeleteShare,
  useGetShareDetail,
  useUpdateShare,
} from "@/src/entities";
import { Header } from "@/src/shared";

const ShareEditPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string | undefined }>();
  const shareId = Number(id);

  const { user } = useAuthStore();
  const { data: share, isLoading } = useGetShareDetail({
    query: { shareId },
  });
  const { mutate: updateShare } = useUpdateShare();
  const { mutate: deleteShare } = useDeleteShare();

  const handleDelete = () => {
    if (!id || Number.isNaN(shareId)) return;
    if (!share) return;

    const hasAttendees =
      Array.isArray(share.attendee_user_ids) &&
      share.attendee_user_ids.length > 0;
    if (hasAttendees) {
      toast.error("참석자가 있어 삭제할 수 없습니다.");
      return;
    }

    if (!window.confirm("정말로 이 나눔을 삭제하시겠습니까?")) return;

    deleteShare(
      { query: { shareId } },
      {
        onSuccess: () => {
          router.push("/share");
          toast.success("나눔이 삭제되었습니다.");
        },
        onError: () => {
          toast.error("나눔 삭제에 실패했습니다.");
        },
      },
    );
  };

  const handleClickSubmit = (body: {
    title: string;
    content: string;
    deadline: string;
    stadium_id: number;
    max_attendees: number;
  }) => {
    updateShare(
      {
        query: { shareId },
        body: {
          title: body.title,
          content: body.content,
          deadline: body.deadline,
          stadium_id: body.stadium_id,
          max_attendees: body.max_attendees,
        },
      },
      {
        onSuccess: () => {
          toast.success("나눔 수정이 완료되었습니다.");
          router.push(`/share/${shareId}`);
        },
        onError: () => {
          toast.error("나눔 수정에 실패했습니다.");
        },
      },
    );
  };

  const defaultValues = useMemo(
    () => (share ? transformApiToShareForm(share) : undefined),
    [share],
  );

  const applicantCount = (() => {
    const ids = share?.attendee_user_ids;
    if (!ids || !Array.isArray(ids)) return 0;
    return ids.length;
  })();

  return (
    <div className="flex h-dvh flex-col">
      <Header
        title={{ text: "나눔 수정", position: "center" }}
        prevPage={{ href: `/share/${shareId}` }}
        rightAction={
          !isLoading && share && user?.id === share.user_id ? (
            <button
              type="button"
              className="flex h-[48px] w-[48px] items-center justify-center text-[14px] font-bold text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              삭제
            </button>
          ) : undefined
        }
      />
      {isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <span className="text-white/60">로딩 중...</span>
        </div>
      )}
      {!isLoading && !share && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <span className="text-white/60">나눔을 찾을 수 없습니다.</span>
          <Link href="/share" className="text-[#5724F0] underline">
            나눔 목록으로 돌아가기
          </Link>
        </div>
      )}
      {!isLoading && share && user?.id !== share.user_id && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <span className="text-white/60">수정 권한이 없습니다.</span>
          <Link href={`/share/${shareId}`} className="text-[#5724F0] underline">
            상세 페이지로 돌아가기
          </Link>
        </div>
      )}
      {!isLoading && share && user?.id === share.user_id && (
        <div className="flex min-h-0 flex-1 flex-col">
          <ShareForm
            defaultValues={defaultValues}
            minAttendees={applicantCount}
            handleClickSubmit={handleClickSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default ShareEditPage;
