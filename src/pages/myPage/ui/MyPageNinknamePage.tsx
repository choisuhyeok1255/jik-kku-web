"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useGetUser, useUpdateNickname } from "@/src/entities";
import { Header, LabelContent } from "@/src/shared";

const MyPageNinknamePage = () => {
  const router = useRouter();

  const { data: user } = useGetUser();
  const { mutate: updateNickname } = useUpdateNickname();

  const [nickname, setNickname] = useState("");

  const handleClickUpdateNickname = () => {
    if (!user?.id) return;

    updateNickname(
      { body: { nickname } },
      {
        onSuccess: () => {
          alert("닉네임이 성공적으로 수정되었습니다.");
          router.push("/myPage");
        },
        onError: () => {
          alert("닉네임 수정에 실패했습니다.");
        },
      },
    );
  };

  useEffect(() => {
    if (!user) return;

    setNickname(user.nickname);
  }, [user]);

  return (
    <div className="flex h-screen flex-col">
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
