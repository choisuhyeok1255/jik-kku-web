"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

import {
  useGetShareDetail,
  useUpdateShare,
  useAuthStore,
} from "@/src/entities";
import { ShareForm, transformApiToShareForm } from "@/src/features";
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
    content: string | null;
    deadline: string;
    stadium_id: number | null;
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
          router.push(`/share/${shareId}`);
        },
        onError: () => {
          alert("나눔 수정에 실패했습니다.");
        },
      },
    );
  };

  const defaultValues = useMemo(
    () => (share ? transformApiToShareForm(share) : undefined),
    [share],
  );

  if (isLoading || !share) {
    return (
      <div className="flex h-screen flex-col">
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
      <div className="flex h-screen flex-col">
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
    <div className="flex h-screen flex-col">
      <Header
        title={{ text: "나눔 수정", position: "center" }}
        prevPage={{ href: `/share/${shareId}` }}
      />
      <div className="flex min-h-0 flex-1 flex-col">
        <ShareForm
          defaultValues={defaultValues}
          handleClickSubmit={handleClickSubmit}
        />
      </div>
    </div>
  );
};

export default ShareEditPage;
