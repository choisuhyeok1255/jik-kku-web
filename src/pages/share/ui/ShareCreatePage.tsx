"use client";

import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { ShareForm } from "@/src/features";
import { usePostShare, useAuthStore } from "@/src/entities";
import { Header, NotLogin } from "@/src/shared";

const ShareCreatePage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { mutate: postShare } = usePostShare();

  const handleClickSubmit = (body: {
    title: string;
    content: string;
    deadline: string;
    stadium_id: number;
    max_attendees: number;
  }) => {
    if (!user?.id) return;

    postShare(
      { body: { ...body, user_id: user.id } },
      {
        onSuccess: () => {
          toast.success("나눔 등록이 완료되었습니다.");
          router.push("/share");
        },
        onError: () => {
          toast.error("나눔 등록에 실패했습니다.");
        },
      },
    );
  };

  if (!user) {
    return <NotLogin />;
  }

  return (
    <div className="flex h-dvh flex-col">
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
