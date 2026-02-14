"use client";

import { CheckIcon } from "lucide-react";

import { cn } from "@/src/shared";

import TeamIcon from "./TeamIcon";

interface TeamCardProps {
  className?: string;
  teamId: number;
  teamName: string;
  teamType: "myTeam" | "opponentTeam";
  selectText?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const TeamCard = ({
  className,
  teamId,
  teamName,
  selectText,
  isSelected = false,
  teamType,
  onClick,
}: TeamCardProps) => {
  const isButton = typeof onClick === "function";

  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <TeamIcon teamId={teamId} size={40} />
        {isSelected && selectText && (
          <div
            className={cn(
              "flex shrink-0 items-center gap-1",
              teamType === "myTeam" && "text-[#9875FF]",
              teamType === "opponentTeam" && "text-[#A2A2A2]",
            )}
          >
            <CheckIcon className="size-4" strokeWidth={2.5} />
            <span className="text-xs font-medium">{selectText}</span>
          </div>
        )}
      </div>
      <div className="text-[14px] font-bold text-white">{teamName}</div>
    </>
  );

  const commonCss = cn(
    className,
    "flex flex-col gap-[8px] rounded-[20px] border p-[12px] text-left",
    !isSelected && "border-white/10 bg-white/[0.04]",
    isSelected &&
      teamType === "myTeam" &&
      "border-[#5724F0] bg-[#5724F0]/[0.04]",
    isSelected && teamType === "opponentTeam" && "border-white bg-white/[0.08]",
  );

  if (isButton) {
    return (
      <button type="button" className={commonCss} onClick={onClick}>
        {content}
      </button>
    );
  }

  return <div className={commonCss}>{content}</div>;
};

export default TeamCard;
