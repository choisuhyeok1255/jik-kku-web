"use client";

import { useMemo, useState } from "react";

import { useGetTeamsWithStadium } from "@/src/entities";
import { cn, Modal } from "@/src/shared";

const StadiumCard = ({
  shortTeamName,
  stadiumName,
  stadiumId,
  selectedStadiumId,
  handleSelectStadium,
}: {
  shortTeamName: string;
  stadiumName: string;
  stadiumId: number;
  selectedStadiumId: number | null;
  handleSelectStadium: (stadiumId: number) => void;
}) => {
  const handleClickStadium = () => {
    // 현재 선택된 경기장은 선택 해제 가능, 선택되지 않은 경기장은 선택 가능
    handleSelectStadium(stadiumId);
  };

  const isSelected = selectedStadiumId === stadiumId;

  return (
    <button
      className={cn(
        "flex flex-col items-start gap-[8px] rounded-[20px] border border-[#FFFFFF]/10 bg-[#FFFFFF]/4 p-[12px]",
        isSelected && "border-[#5724F0] bg-[#5724F0]/4",
      )}
      style={{ height: "78px" }}
      type="button"
      onClick={handleClickStadium}
    >
      <div className="rounded-[999px] bg-white/10 px-[8px] py-[2px] text-left text-[12px] font-bold">
        {shortTeamName}
      </div>
      <div className="text-left text-[14px] font-bold text-white">
        {stadiumName}
      </div>
    </button>
  );
};

const GameLogStadiumModal = ({
  initSelectedStadiumId,
  handleClickStadium,
  handleCloseModal,
}: {
  initSelectedStadiumId: number | null;
  handleClickStadium: (stadiumId: number | null) => void;
  handleCloseModal: () => void;
}) => {
  const { data: teamsWithStadiums } = useGetTeamsWithStadium();

  const uniqueStadiums = useMemo(() => {
    if (!teamsWithStadiums) return [];
    const stadiumMap = new Map<
      number,
      { stadiumId: number; stadiumName: string; shortTeamNames: string[] }
    >();
    for (const team of teamsWithStadiums) {
      const stadiumId = team.stadium?.id ?? 0;
      const existing = stadiumMap.get(stadiumId);
      if (existing) {
        existing.shortTeamNames.push(team.short_team_name ?? "");
      } else {
        stadiumMap.set(stadiumId, {
          stadiumId,
          stadiumName: team.stadium?.name ?? "",
          shortTeamNames: [team.short_team_name ?? ""],
        });
      }
    }
    return Array.from(stadiumMap.values());
  }, [teamsWithStadiums]);

  const [selectedStadiumId, setSelectedStadiumId] = useState<number | null>(
    initSelectedStadiumId,
  );

  const handleSelectStadium = (stadiumId: number) => {
    setSelectedStadiumId((prev) => {
      if (prev === stadiumId) {
        return null;
      }
      return stadiumId;
    });
  };

  const handleClickSubmit = () => {
    handleClickStadium(selectedStadiumId);
    handleCloseModal();
  };

  return (
    <Modal>
      <div className="mb-[24px] text-[20px]">경기장</div>
      <div className="mb-[32px] min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-[12px]">
          {uniqueStadiums.map((stadium) => (
            <StadiumCard
              key={stadium.stadiumId}
              shortTeamName={stadium.shortTeamNames.join(" / ")}
              stadiumName={stadium.stadiumName}
              stadiumId={stadium.stadiumId}
              selectedStadiumId={selectedStadiumId}
              handleSelectStadium={handleSelectStadium}
            />
          ))}
        </div>
      </div>
      <button
        className={cn(
          "h-[56px] w-full rounded-[20px] text-[16px] text-white",
          selectedStadiumId && "bg-[#5724F0]",
        )}
        disabled={!selectedStadiumId}
        type="button"
        onClick={handleClickSubmit}
        style={
          !selectedStadiumId
            ? { backgroundColor: "rgba(56, 52, 68, 0.6)" }
            : undefined
        }
      >
        선택완료
      </button>
    </Modal>
  );
};

export default GameLogStadiumModal;
