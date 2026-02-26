"use client";

import { useState } from "react";

import { TeamCard, useGetTeams } from "@/src/entities";
import { AppTab, Modal } from "@/src/shared";

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

  const [selectedTeamId, setSelectedTeamId] = useState<{
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
      setSelectedTeamId((prev) => {
        if (prev.homeTeamId === teamId) {
          return { ...prev, homeTeamId: null };
        }

        return { ...prev, homeTeamId: teamId };
      });
    } else {
      setSelectedTeamId((prev) => {
        if (prev.awayTeamId === teamId) {
          return { ...prev, awayTeamId: null };
        }

        return { ...prev, awayTeamId: teamId };
      });
    }
  };

  const handleClickSubmit = () => {
    handleClickTeam({
      homeTeamId: selectedTeamId.homeTeamId,
      awayTeamId: selectedTeamId.awayTeamId,
    });
    handleCloseModal();
  };

  const selectedTeamCount = [
    selectedTeamId.homeTeamId,
    selectedTeamId.awayTeamId,
  ].filter(Boolean).length;

  return (
    <Modal handleCloseModal={handleCloseModal}>
      <AppTab
        className="mb-[24px] w-full shrink-0"
        currentTab={currentTab}
        tabItems={[
          { label: "응원팀", value: "homeTeam" },
          { label: "상대팀", value: "awayTeam" },
        ]}
        handleChangeTab={(tab) => setCurrentTab(tab as "homeTeam" | "awayTeam")}
      />
      <div className="mb-[32px] min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-[12px]">
          {teams?.map((team) => {
            const isHomeSelected = selectedTeamId.homeTeamId === team.id;
            const isAwaySelected = selectedTeamId.awayTeamId === team.id;
            const isSelected = isHomeSelected || isAwaySelected;
            const isSelectedInOtherTab =
              (currentTab === "homeTeam" &&
                selectedTeamId.awayTeamId === team.id) ||
              (currentTab === "awayTeam" &&
                selectedTeamId.homeTeamId === team.id);
            const teamType =
              selectedTeamId.homeTeamId === team.id ? "myTeam" : "opponentTeam";
            const selectText = teamType === "myTeam" ? "응원팀" : "상대팀";

            return (
              <TeamCard
                key={team.id}
                teamId={team.id}
                teamName={team.team_name ?? ""}
                teamType={teamType}
                selectText={selectText}
                isSelected={isSelected}
                onClick={
                  isSelectedInOtherTab
                    ? undefined
                    : () => handleSelectTeam(team.id)
                }
              />
            );
          })}
        </div>
      </div>
      <button
        className="h-[48px] w-full shrink-0 rounded-[20px] bg-[#5724F0] text-[16px] text-white"
        type="button"
        onClick={handleClickSubmit}
      >
        선택완료({selectedTeamCount}/2)
      </button>
    </Modal>
  );
};

export default GameLogTeamModal;
