"use client";

import HelmetIcon from "@/public/helmet-fill.svg";
import { cn } from "@/src/shared";

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

const ICON_SIZE_MAP: Record<number, number> = {
  28: 18,
  40: 24,
};

type TeamIconSize = 28 | 40;

interface TeamIconProps {
  teamId: number;
  className?: string;
  size?: TeamIconSize;
}

const ICON_SIZE_CLASSES: Record<number, string> = {
  18: "h-[18px] w-[18px]",
  24: "h-[24px] w-[24px]",
};

const TeamIcon = ({ teamId, className, size = 40 }: TeamIconProps) => {
  const iconSize = ICON_SIZE_MAP[size];
  const colors = COLOR_MAP[teamId];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        colors?.bgClassName ?? "bg-white/10",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <HelmetIcon
        className={cn(
          ICON_SIZE_CLASSES[iconSize],
          colors?.iconClassName ?? "fill-white",
        )}
      />
    </div>
  );
};

export default TeamIcon;
