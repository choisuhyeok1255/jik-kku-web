"use client";

import { useRouter } from "next/navigation";

import { usePostShare, useAuthStore } from "@/src/entities";
import { ShareForm } from "@/src/features";
import { Header } from "@/src/shared";
import { toast } from "sonner";

const ShareCreatePage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { mutate: postShare } = usePostShare();

  const handleClickSubmit = (body: {
    title: string;
    content: string | null;
    deadline: string;
    stadium_id: number | null;
    max_attendees: number;
  }) => {
    if (!user?.id) return;

    postShare(
      { body: { ...body, user_id: user.id } },
      {
        onSuccess: () => {
          router.push("/share");
        },
        onError: () => {
          toast.error("나눔 등록에 실패했습니다.");
        },
      },
    );
  };

  return (
    <div className="flex h-screen flex-col">
      <Header
        className="mb-[12px] shrink-0"
        title={{ text: "나눔 등록", position: "center" }}
        prevPage={{ href: "/share" }}
      />
      <div className="flex min-h-0 flex-1 flex-col">
        <ShareForm handleClickSubmit={handleClickSubmit} />
      </div>
    </div>
  );
};

export default ShareCreatePage;
