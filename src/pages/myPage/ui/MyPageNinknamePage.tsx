"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { toast } from "sonner";
import { useGetUser, useUpdateNickname } from "@/src/entities";
import { Header, LabelContent } from "@/src/shared";

const MyPageNinknamePage = () => {
  const router = useRouter();

  const { data: user } = useGetUser();
  const { mutate: updateNickname } = useUpdateNickname();

  const [nickname, setNickname] = useState(user?.nickname ?? "");

  const handleClickUpdateNickname = () => {
    if (!user?.id) return;

    updateNickname(
      { body: { nickname } },
      {
        onSuccess: () => {
          toast.success("닉네임이 성공적으로 수정되었습니다.");
          router.push("/myPage");
        },
        onError: (error: unknown) => {
          const err = error as { code?: string };

          if (err.code === "23505") {
            toast.error("이미 사용 중인 닉네임입니다.");
          } else {
            toast.error("닉네임 수정에 실패했습니다.");
          }
        },
      },
    );
  };

  return (
    <div key={user?.id ?? "loading"} className="flex h-dvh flex-col">
      <Header
        className="mb-[20px] shrink-0"
        title={{ text: "닉네임 수정", position: "center" }}
        prevPage={{ href: "/myPage" }}
      />
      <div className="flex flex-1 flex-col px-[16px]">
        <LabelContent label="닉네임" isRequired>
          <input
            placeholder="닉네임을 입력해주세요."
            className="w-full rounded-[20px] border border-white/10 bg-[#ffffff]/4 p-[14px] text-start text-[14px]"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </LabelContent>
        <div className="mt-auto px-[4px] py-[24px]">
          <button
            className="h-[56px] w-full rounded-[20px] bg-[#5724F0] text-[16px] text-white"
            onClick={handleClickUpdateNickname}
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPageNinknamePage;
