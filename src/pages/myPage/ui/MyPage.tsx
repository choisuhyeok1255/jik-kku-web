"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useGetTeams, useGetUser, TeamIcon } from "@/src/entities";
import { Header, NotLogin, Skeleton, cn, supabase } from "@/src/shared";

const CARD_BASE =
  "rounded-[20px] border border-white/10 bg-white/[0.04] p-[20px]";

/** 버튼형 카드 (화살표 포함) */
const MyPageCardButton = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) => (
  <button
    type="button"
    className={`${CARD_BASE} flex w-full items-center justify-between`}
    onClick={onClick}
  >
    {children}
    <span className="text-lg font-bold text-white/60">&gt;</span>
  </button>
);

/** 카드 내부 아이콘 래퍼 */
const CardIcon = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={cn(
      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg",
      className,
    )}
  >
    {children}
  </div>
);

const MyPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: teams, isLoading: isLoadingTeams } = useGetTeams();
  const { data: user, isLoading: isLoadingUser } = useGetUser();

  if (isLoadingUser || isLoadingTeams) {
    return (
      <div className="flex h-dvh flex-col">
        <Header
          className="mb-[12px] shrink-0"
          title={{ text: "마이페이지", position: "left" }}
        />
        <div className="flex min-h-0 flex-1 flex-col gap-[12px] overflow-y-auto px-[16px] pb-[150px]">
          <div className={CARD_BASE}>
            <div className="flex h-[40px] items-center gap-[12px]">
              <Skeleton className="h-[32px] w-[32px] shrink-0 rounded-full bg-white/10" />
              <Skeleton className="h-[20px] w-[128px] bg-white/10" />
            </div>
          </div>
          <div className={CARD_BASE}>
            <div className="flex flex-col gap-[16px]">
              <div className="flex items-center gap-[12px]">
                <Skeleton className="h-[28px] w-[28px] shrink-0 rounded-full bg-white/10" />
                <Skeleton className="h-[16px] w-[64px] bg-white/10" />
              </div>
              <Skeleton className="h-[30px] w-[96px] bg-white/10" />
            </div>
          </div>
          <div className="flex h-[48px] items-center justify-center">
            <Skeleton className="h-[16px] w-[64px] bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <NotLogin />;
  }

  return (
    <div className="flex h-dvh flex-col">
      <Header
        className="mb-[12px] shrink-0"
        title={{ text: "마이페이지", position: "left" }}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-[12px] overflow-y-auto px-[16px] pb-[150px]">
        <MyPageCardButton onClick={() => router.push("/myPage/nickname")}>
          <div className="flex h-[40px] min-w-0 items-center gap-3">
            <CardIcon className="shrink-0 bg-white/10">👤</CardIcon>
            <span className="min-w-0 truncate text-[20px] font-bold text-[#ffffff]">
              {user?.nickname ?? ""}
            </span>
          </div>
        </MyPageCardButton>

        <MyPageCardButton onClick={() => router.push("/myPage/team")}>
          <div className="flex flex-col gap-[16px]">
            {user?.team_id ? (
              <>
                <div className="flex items-center gap-3">
                  <TeamIcon teamId={user.team_id} size={28} />
                  <span className="text-[14px] text-[#ffffff]">응원팀</span>
                </div>
                <span className="text-left text-[20px] font-bold text-[#ffffff]">
                  {teams?.find((t) => t.id === user.team_id)?.team_name}
                </span>
              </>
            ) : (
              <span className="text-[20px] font-bold text-[#ffffff]">
                응원팀을 설정해 주세요
              </span>
            )}
          </div>
        </MyPageCardButton>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            queryClient.clear();
            router.push("/");
          }}
        >
          <div className="flex h-[48px] min-w-0 items-center justify-center gap-3">
            <span className="min-w-0 truncate text-[14px] font-bold text-[#ffffff]/60">
              로그아웃
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default MyPage;
