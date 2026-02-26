"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useGetUser } from "@/src/entities";

const TeamSettingGuard = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const { data: user, isLoading } = useGetUser();

  const excludedPaths = ["/myPage/team", "/auth"];
  const isExcluded = excludedPaths.some((p) => pathname?.startsWith(p));
  const shouldShowGuard = !isLoading && !!user && !user.team_id && !isExcluded;

  useEffect(() => {
    if (shouldShowGuard) {
      router.push("/myPage/team");
    }
  }, [shouldShowGuard, router]);

  if (shouldShowGuard) {
    return null;
  }

  return <>{children}</>;
};

export default TeamSettingGuard;
