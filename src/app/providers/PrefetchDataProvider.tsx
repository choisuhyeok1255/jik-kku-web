"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import {
  getStadiums,
  getTeams,
  getTeamsWithStadium,
} from "@/src/entities";

const PrefetchDataProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
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
