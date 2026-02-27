"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useMemo } from "react";

import { toast } from "sonner";
import { ShareForm, transformApiToShareForm } from "@/src/features";
import {
  useGetShareDetail,
  useUpdateShare,
  useAuthStore,
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

  if (isLoading || !share) {
    return (
      <div className="flex h-dvh flex-col">
        <Header
          title={{ text: "나눔 수정", position: "center" }}
          prevPage={{ href: `/share/${shareId}` }}
        />
        <div className="flex flex-1 items-center justify-center">
          <span className="text-white/60">로딩 중...</span>
        </div>
      </div>
    );
  }

  if (user?.id !== share.user_id) {
    return (
      <div className="flex h-dvh flex-col">
        <Header
          title={{ text: "나눔 수정", position: "center" }}
          prevPage={{ href: `/share/${shareId}` }}
        />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <span className="text-white/60">수정 권한이 없습니다.</span>
          <Link href={`/share/${shareId}`} className="text-[#5724F0] underline">
            상세 페이지로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col">
      <Header
        title={{ text: "나눔 수정", position: "center" }}
        prevPage={{ href: `/share/${shareId}` }}
      />
      <div className="flex min-h-0 flex-1 flex-col">
        <ShareForm
          defaultValues={defaultValues}
          minAttendees={applicantCount}
          handleClickSubmit={handleClickSubmit}
        />
      </div>
    </div>
  );
};

export default ShareEditPage;
