"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { useGetUser, useUpdateUser } from "@/src/entities";
import {
  AvatarIcon,
  AVATAR_ICONS,
  Header,
  LabelContent,
  cn,
} from "@/src/shared";

const MyPageNinknamePage = () => {
  const router = useRouter();

  const { data: user } = useGetUser();
  const { mutate: updateUser } = useUpdateUser();

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [avatar, setAvatar] = useState<string | null>(user?.avatar ?? null);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname ?? "");
      setAvatar(user.avatar ?? null);
    }
  }, [user]);

  const handleClickUpdateUser = () => {
    if (!user?.id) return;

    if (!nickname) {
      toast.error("닉네임을 입력해주세요.");
      return;
    }

    if (!avatar) {
      toast.error("아바타를 선택해주세요.");
      return;
    }

    updateUser(
      { body: { nickname, avatar } },
      {
        onSuccess: () => {
          toast.success("유저 정보가 성공적으로 수정되었습니다.");
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
        title={{ text: "유저 정보 수정", position: "center" }}
        prevPage={{ href: "/myPage" }}
      />

      <div className="flex flex-1 flex-col px-[16px]">
        <div className="flex flex-col gap-[24px]">
          <LabelContent label="닉네임" isRequired>
            <input
              placeholder="닉네임을 입력해주세요."
              className="w-full rounded-[20px] border border-white/10 bg-[#ffffff]/4 p-[14px] text-start text-[14px]"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </LabelContent>
          <LabelContent label="아바타" isRequired>
            <div className="grid grid-cols-6 gap-[12px]">
              {AVATAR_ICONS.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setAvatar(iconName)}
                  className={cn(
                    "flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[12px] transition-colors",
                    avatar === iconName
                      ? "border-2 border-[#5724F0] bg-[#5724F0]/20"
                      : "border border-white/10 bg-[#ffffff]/4 hover:bg-white/10",
                  )}
                >
                  <AvatarIcon iconName={iconName} size={32} />
                </button>
              ))}
            </div>
          </LabelContent>
        </div>
        <div className="mt-auto px-[4px] py-[24px]">
          <button
            className="h-[56px] w-full rounded-[20px] bg-[#5724F0] text-[16px] text-white"
            onClick={handleClickUpdateUser}
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPageNinknamePage;
