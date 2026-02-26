"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import HomeActiveIcon from "@/public/home-active.svg";
import HomeUnActiveIcon from "@/public/home-un-active.svg";
import RankActiveIcon from "@/public/ranking-active.svg";
import RankUnActiveIcon from "@/public/ranking-un-active.svg";
import NoticeBoardActiveIcon from "@/public/notice-board-active.svg";
import NoticeBoardUnActiveIcon from "@/public/notice-board-un-active.svg";
import PersonActiveIcon from "@/public/person-active.svg";
import PersonUnActiveIcon from "@/public/person-un-active.svg";
import { cn } from "../lib/tailwind";

const homeItem = {
  label: "홈",
  href: "/",
  activeIcon: HomeActiveIcon,
  unActiveIcon: HomeUnActiveIcon,
};
const rankItem = {
  label: "랭킹",
  href: "/ranking",
  activeIcon: RankActiveIcon,
  unActiveIcon: RankUnActiveIcon,
};
const shareItem = {
  label: "나눔",
  href: "/share",
  activeIcon: NoticeBoardActiveIcon,
  unActiveIcon: NoticeBoardUnActiveIcon,
};
const myPageItem = {
  label: "마이페이지",
  href: "/myPage",
  activeIcon: PersonActiveIcon,
  unActiveIcon: PersonUnActiveIcon,
};

const BottomNavigation = () => {
  const pathname = usePathname();

  const navigationItems = [homeItem, rankItem, shareItem, myPageItem];

  return (
    <nav className="fixed bottom-[21px] left-1/2 z-50 flex w-[361px] -translate-x-1/2 items-center justify-between rounded-[999px] bg-[#1E1E1E] px-[10px] py-[12px] shadow-lg">
      {navigationItems.map((item, i) => {
        const isActive = pathname === item.href;
        const Icon = isActive ? item.activeIcon : item.unActiveIcon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center justify-center gap-[6px]",
              isActive
                ? "h-[54px] rounded-[44px] bg-[#333333] p-[15px]"
                : "h-[44px] min-w-[52px] items-center justify-center",
            )}
          >
            <Icon />
            {isActive && item.label && (
              <span className="text-xs font-medium">{item.label}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
