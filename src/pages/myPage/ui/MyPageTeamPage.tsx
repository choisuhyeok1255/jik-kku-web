"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  TeamCard,
  useGetTeams,
  useGetUser,
  useUpdateTeam,
} from "@/src/entities";
import { Header } from "@/src/shared";

const MyPageTeamPage = () => {
  const router = useRouter();

  const { data: user, refetch: refetchUser } = useGetUser();
  const { data: teams } = useGetTeams();
  const { mutate: updateTeam } = useUpdateTeam();

  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(
    user?.team_id ?? null,
  );

  const handleClickTeam = (teamId: number) => {
    setSelectedTeamId(teamId);
  };

  const handleClickSubmit = () => {
    if (!selectedTeamId) return;

    updateTeam(
      { body: { team_id: selectedTeamId } },
      {
        onSuccess: async () => {
          toast.success("응원팀이 성공적으로 변경되었습니다.");
          await refetchUser();
          router.push("/myPage");
        },
        onError: () => {
          toast.error("응원팀 변경에 실패했습니다.");
        },
      },
    );
  };

  return (
    <div key={user?.id ?? "loading"} className="flex h-screen flex-col">
      <Header
        className="mb-[12px] shrink-0"
        title={{
          text: user?.team_id ? "응원팀 변경" : "응원팀 설정",
          position: "center",
        }}
        {...(user?.team_id && { prevPage: { href: "/myPage" } })}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[16px] pb-[24px]">
        <div className="grid grid-cols-2 gap-[12px]">
          {teams?.map((team) => (
            <TeamCard
              key={team.id}
              isSelected={selectedTeamId === team.id}
              teamId={team.id}
              teamName={team.team_name ?? ""}
              teamType="myTeam"
              selectText="응원팀"
              onClick={() => handleClickTeam(team.id)}
            />
          ))}
        </div>
      </div>
      <div className="px-[16px] py-[24px]">
        <button
          className="h-[56px] w-full rounded-[20px] bg-[#5724F0] text-[16px] text-white"
          type="button"
          onClick={handleClickSubmit}
        >
          완료
        </button>
      </div>
    </div>
  );
};

export default MyPageTeamPage;
