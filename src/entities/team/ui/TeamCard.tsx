"use client";

import { CheckIcon } from "lucide-react";

import { cn } from "@/src/shared";
import HelmetIcon from "@/public/helmet-fill.svg";

const COLOR_MAP: Record<
  number,
  { iconClassName: string; bgClassName: string }
> = {
  1: { iconClassName: "fill-[#184493]", bgClassName: "bg-[#6391E4]" },
  2: { iconClassName: "fill-[#AC2749]", bgClassName: "bg-[#560F21]" },
  3: { iconClassName: "fill-[#E9531E]", bgClassName: "bg-[#612A17]" },
  4: { iconClassName: "fill-[#3D5D9D]", bgClassName: "bg-[#021233]" },
  5: { iconClassName: "fill-[#000000]", bgClassName: "bg-[#5E5E5E]" },
  6: { iconClassName: "fill-[#0C1C38]", bgClassName: "bg-[#4F80D6]" },
  7: { iconClassName: "fill-[#D42E2B]", bgClassName: "bg-[#651110]" },
  8: { iconClassName: "fill-[#18183E]", bgClassName: "bg-[#5C5CD2]" },
  9: { iconClassName: "fill-[#471215]", bgClassName: "bg-[#D54B52]" },
  10: { iconClassName: "fill-[#B82B2C]", bgClassName: "bg-[#4F0808]" },
};

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
        <div
          className={cn(
            "flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full",
            COLOR_MAP[teamId]?.bgClassName ?? "bg-white/10",
          )}
        >
          <HelmetIcon
            className={cn(
              "h-[24px] w-[24px]",
              COLOR_MAP[teamId]?.iconClassName ?? "fill-white",
            )}
          />
        </div>
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
