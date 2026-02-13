"use client";

import { usePathname } from "next/navigation";

import { BottomNavigation } from "@/src/shared";

const HIDDEN_PATHS: string[] = ["/game-logs/create", "/admin"];

const ConditionalBootomNavigation = () => {
  const pathname = usePathname();

  if (!pathname) return null;

  const shouldHide = HIDDEN_PATHS.some((path) => pathname.startsWith(path));

  if (shouldHide) {
    return null;
  }

  return <BottomNavigation />;
};

export default ConditionalBootomNavigation;
