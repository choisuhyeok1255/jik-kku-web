"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import {
  getShares,
  getStadiums,
  getTeams,
  getTeamsWithStadium,
  shareKeys,
} from "@/src/entities";

const PrefetchDataProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: shareKeys.list(),
      queryFn: getShares,
    });
    void queryClient.prefetchQuery({
      queryKey: ["stadiums"],
      queryFn: getStadiums,
      staleTime: Infinity,
    });
    void queryClient.prefetchQuery({
      queryKey: ["teams"],
      queryFn: getTeams,
      staleTime: Infinity,
    });
    void queryClient.prefetchQuery({
      queryKey: ["teamsWithStadium"],
      queryFn: getTeamsWithStadium,
      staleTime: Infinity,
    });
  }, [queryClient]);

  return <>{children}</>;
};

export default PrefetchDataProvider;
