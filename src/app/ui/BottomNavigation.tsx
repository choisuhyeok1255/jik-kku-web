"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import AddWhiteIcon from "@/public/add-white.svg";
import CalendarActiveIcon from "@/public/calendar-active.svg";
import CalendarUnActiveIcon from "@/public/calendar-un-active.svg";
import HomeActiveIcon from "@/public/home-active.svg";
import HomeUnActiveIcon from "@/public/home-un-active.svg";
import NoticeBoardActiveIcon from "@/public/notice-board-active.svg";
import NoticeBoardUnActiveIcon from "@/public/notice-board-un-active.svg";
import PersonActiveIcon from "@/public/person-active.svg";
import PersonUnActiveIcon from "@/public/person-un-active.svg";
import RankActiveIcon from "@/public/ranking-active.svg";
import RankUnActiveIcon from "@/public/ranking-un-active.svg";
import { useAuthStore, useGetUserWinStatsSummary } from "@/src/entities";
import { cn } from "@/src/shared";

const HIDDEN_PATHS: string[] = [
  "/game-logs/create",
  "/game-logs/", // [id]/edit
  "/share/create",
  "/share/",
  "/admin",
  "/my-page/nickname",
  "/my-page/team",
  "/my-page/inquiry/create",
  "/my-page/service-info",
];

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
const calendarItem = {
  label: "일정",
  href: "/calendar",
  activeIcon: CalendarActiveIcon,
  unActiveIcon: CalendarUnActiveIcon,
};
const myPageItem = {
  label: "마이페이지",
  href: "/my-page",
  activeIcon: PersonActiveIcon,
  unActiveIcon: PersonUnActiveIcon,
};

const BottomNavigation = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const { data: winStatsSummary } = useGetUserWinStatsSummary(user?.id || "");

  const tabParam = searchParams?.get("tab");
  const isGameLogsTab = tabParam === "gameLogs";

  const addButton = useMemo(() => {
    if (pathname?.startsWith("/share")) {
      return { href: "/share/create" };
    }
    if (
      pathname === "/" &&
      isGameLogsTab &&
      user &&
      winStatsSummary &&
      winStatsSummary.total > 0
    ) {
      return { href: "/game-logs/create" };
    }
    if (pathname === "/my-page/inquiry") {
      return { href: "/my-page/inquiry/create" };
    }
    return null;
  }, [pathname, isGameLogsTab, user, winStatsSummary]);

  if (!pathname) return null;

  const shouldHide = HIDDEN_PATHS.some((path) => pathname.startsWith(path));
  if (shouldHide) return null;

  const navigationItems = [
    homeItem,
    rankItem,
    calendarItem,
    shareItem,
    myPageItem,
  ];

  return (
    <div className="fixed bottom-[21px] left-1/2 z-50 -translate-x-1/2">
      {user && addButton?.href && (
        <Link
          className="absolute right-0 bottom-full mb-[12px] flex h-[50px] w-[50px] items-center justify-center gap-[6px] rounded-[71px] bg-[#5724F0] shadow-[0px_4px_8px_0px_#00000033]"
          href={addButton.href}
        >
          <AddWhiteIcon />
        </Link>
      )}
      <nav className="flex w-[361px] items-center justify-between rounded-[999px] bg-[#1E1E1E] px-[10px] py-[12px] shadow-lg">
        {navigationItems.map((item) => {
          // 홈("/")은 모든 경로가 startsWith("/")이므로 정확히 일치만 체크
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
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
    </div>
  );
};

export default BottomNavigation;
