"use client";

import { useState } from "react";

import { AppTab, cn, Modal } from "@/src/shared";
import { useGetTeams } from "@/src/entities";

const TeamCard = ({
  teamName,
  teamId,
  selectedTeamIds,
  currentTab,
  handleSelectTeam,
}: {
  teamName: string;
  teamId: number;
  selectedTeamIds: { homeTeamId: number | null; awayTeamId: number | null };
  currentTab: "homeTeam" | "awayTeam";
  handleSelectTeam: (teamId: number) => void;
}) => {
  const handleClickTeam = () => {
    // 다른 탭에서 선택된 팀은 선택 불가 (서로 바뀌는 것 방지)
    const isSelectedInOtherTab =
      (currentTab === "homeTeam" && selectedTeamIds.awayTeamId === teamId) ||
      (currentTab === "awayTeam" && selectedTeamIds.homeTeamId === teamId);
    if (isSelectedInOtherTab) return;

    // 현재 탭에서 선택된 팀은 선택 해제 가능, 선택되지 않은 팀은 선택 가능
    handleSelectTeam(teamId);
  };

  return (
    <button
      className={cn(
        "h-[96px] rounded-[20px] border border-[#FFFFFF]/10 bg-[#FFFFFF]/4 p-[12px]",
        selectedTeamIds.homeTeamId === teamId &&
          "border-[#5724F0] bg-[#5724F0]/4",
        selectedTeamIds.awayTeamId === teamId &&
          "border-[#FFFFFF] bg-[#FFFFFF]/8",
      )}
      type="button"
      onClick={handleClickTeam}
    >
      <div className="text-[14px] font-bold text-white">{teamName}</div>
    </button>
  );
};

const GameLogTeamModal = ({
  initSelectedTeamId,
  initCurrentTab,
  handleClickTeam,
  handleCloseModal,
}: {
  initSelectedTeamId: { homeTeamId: number | null; awayTeamId: number | null };
  initCurrentTab: "homeTeam" | "awayTeam";
  handleClickTeam: ({
    homeTeamId,
    awayTeamId,
  }: {
    homeTeamId: number | null;
    awayTeamId: number | null;
  }) => void;
  handleCloseModal: () => void;
}) => {
  const { data: teams } = useGetTeams();

  const [selectedTeamIds, setSelectedTeamIds] = useState<{
    homeTeamId: number | null;
    awayTeamId: number | null;
  }>({
    homeTeamId: initSelectedTeamId.homeTeamId,
    awayTeamId: initSelectedTeamId.awayTeamId,
  });
  const [currentTab, setCurrentTab] = useState<"homeTeam" | "awayTeam">(
    initCurrentTab,
  );

  const handleSelectTeam = (teamId: number) => {
    if (currentTab === "homeTeam") {
      setSelectedTeamIds((prev) => {
        if (prev.homeTeamId === teamId) {
          return { ...prev, homeTeamId: null };
        }

        return { ...prev, homeTeamId: teamId };
      });
    } else {
      setSelectedTeamIds((prev) => {
        if (prev.awayTeamId === teamId) {
          return { ...prev, awayTeamId: null };
        }

        return { ...prev, awayTeamId: teamId };
      });
    }
  };

  const handleClickSubmit = () => {
    handleClickTeam({
      homeTeamId: selectedTeamIds.homeTeamId,
      awayTeamId: selectedTeamIds.awayTeamId,
    });
    handleCloseModal();
  };

  const selectedTeamCount = [
    selectedTeamIds.homeTeamId,
    selectedTeamIds.awayTeamId,
  ].filter(Boolean).length;

  return (
    <Modal handleCloseModal={handleCloseModal}>
      <AppTab
        className="mb-[24px] w-full"
        currentTab={currentTab}
        tabItems={[
          { label: "응원팀", value: "homeTeam" },
          { label: "상대팀", value: "awayTeam" },
        ]}
        handleChangeTab={(tab) => setCurrentTab(tab as "homeTeam" | "awayTeam")}
      />
      <div className="mb-[32px] flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-[12px]">
          {teams?.map((team) => (
            <TeamCard
              key={team.id}
              teamName={team.team_name}
              teamId={team.id}
              selectedTeamIds={selectedTeamIds}
              handleSelectTeam={handleSelectTeam}
              currentTab={currentTab}
            />
          ))}
        </div>
      </div>
      <button
        className="h-[48px] w-full rounded-[20px] bg-[#5724F0] text-[16px] text-white"
        type="button"
        onClick={handleClickSubmit}
      >
        선택완료({selectedTeamCount}/2)
      </button>
    </Modal>
  );
};

export default GameLogTeamModal;
