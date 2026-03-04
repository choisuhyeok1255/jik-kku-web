"use client";

import { useState } from "react";

import CheckIcon from "@/public/check.svg";
import { useGetKboEventsByDate } from "@/src/entities";
import type { KboEventRow } from "@/src/entities";
import { cn, Modal, Spinner } from "@/src/shared";

import { findTeamIdByKboName } from "../lib/kboTeamMapping";

const GameLogSearchModal = ({
  date,
  teams,
  stadiums,
  handleCloseModal,
  onSelectEvent,
}: {
  date: string;
  teams: {
    id: number;
    team_name: string | null;
    short_team_name: string | null;
    stadium_id: number | null;
  }[];
  stadiums: { id: number; name: string | null }[];
  handleCloseModal: () => void;
  onSelectEvent: (event: KboEventRow) => void;
}) => {
  const { data: kboEvents, isLoading } = useGetKboEventsByDate({ date });
  const [selectedEvent, setSelectedEvent] = useState<KboEventRow | null>(null);

  const getDisplayNames = (event: KboEventRow) => {
    const homeTeamId = findTeamIdByKboName(event.strHomeTeam, teams);
    const awayTeamId = findTeamIdByKboName(event.strAwayTeam, teams);
    const homeTeam = teams.find((t) => t.id === homeTeamId);
    const stadiumId = homeTeam?.stadium_id ?? null;
    const stadium = stadiumId
      ? stadiums.find((s) => s.id === stadiumId)
      : null;

    return {
      homeTeamName: homeTeam?.team_name ?? event.strHomeTeam,
      awayTeamName: teams.find((t) => t.id === awayTeamId)?.team_name ?? event.strAwayTeam,
      stadiumName: stadium?.name ?? event.strVenue ?? "경기장 정보 없음",
    };
  };

  const handleSelectEvent = (event: KboEventRow) => {
    setSelectedEvent((prev) =>
      prev?.idEvent === event.idEvent ? null : event,
    );
  };

  const handleClickSubmit = () => {
    if (selectedEvent) {
      onSelectEvent(selectedEvent);
    }
    handleCloseModal();
  };

  return (
    <Modal handleCloseModal={handleCloseModal}>
      <div className="mb-[8px] shrink-0 text-[20px] font-bold text-white">
        {date} KBO 경기
      </div>
      <div className="mb-[24px] text-[12px] text-white/60">
        해당 날짜에 진행한 경기만 리스트에 나와요
      </div>
      <div className="mb-[32px] min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Spinner className="size-8 text-white" />
          </div>
        ) : !kboEvents?.length ? (
          <div className="flex min-h-[200px] items-center justify-center text-[14px] text-white/60">
            해당 날짜에 경기가 없어요
          </div>
        ) : (
          <div className="flex flex-col gap-[12px]">
            {kboEvents.map((event) => {
              const isSelected = selectedEvent?.idEvent === event.idEvent;
              const { homeTeamName, awayTeamName, stadiumName } =
                getDisplayNames(event);
              return (
                <button
                  key={event.idEvent}
                  className={cn(
                    "flex flex-col gap-[4px] rounded-[20px] border border-[#FFFFFF]/10 bg-[#FFFFFF]/4 p-[12px] text-left",
                    isSelected && "border-[#5724F0] bg-[#5724F0]/4",
                  )}
                  type="button"
                  onClick={() => handleSelectEvent(event)}
                >
                  <div className="flex w-full items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-bold text-white">
                        {homeTeamName} vs {awayTeamName}
                      </div>
                      <div className="text-[12px] text-white/80">
                        {event.strStatus === "FT"
                          ? `${event.intHomeScore} : ${event.intAwayScore}`
                          : "경기 예정"}
                      </div>
                      <div className="text-[12px] text-white/60">
                        {stadiumName}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="flex shrink-0 items-center gap-[4px]">
                        <CheckIcon />
                        <span className="text-[14px] font-bold text-[#9875FF]">
                          선택됨
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <button
        className={cn(
          "h-[56px] w-full shrink-0 rounded-[20px] text-[16px] text-white",
          selectedEvent && "bg-[#5724F0]",
        )}
        disabled={!selectedEvent}
        type="button"
        onClick={handleClickSubmit}
        style={
          !selectedEvent
            ? { backgroundColor: "rgba(56, 52, 68, 0.6)" }
            : undefined
        }
      >
        선택완료
      </button>
    </Modal>
  );
};

export default GameLogSearchModal;
