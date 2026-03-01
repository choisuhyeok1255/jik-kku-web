"use client";

import { cn } from "@/src/shared";
import type { AvatarIconName } from "../lib/avatarIcons";

interface AvatarIconProps {
  iconName: AvatarIconName | string | null;
  className?: string;
  size?: number;
}

const AvatarIcon = ({ iconName, className, size = 32 }: AvatarIconProps) => {
  if (!iconName) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-white/10",
          className,
        )}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-white/10",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/${iconName}.svg`}
        alt=""
        width={size}
        height={size}
        className="h-full w-full object-contain"
      />
    </div>
  );
};

export default AvatarIcon;
