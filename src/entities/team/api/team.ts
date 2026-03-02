import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/shared";
import { TeamServerModel } from "../model/types/api";

export const getTeams = async () => {
  const { data } = await supabase.from("teams").select("*");
  return data as TeamServerModel[];
};

export const useGetTeams = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
    select: (data) =>
      data.sort((a, b) => a.team_name?.localeCompare(b.team_name ?? "") ?? 0),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: options?.enabled ?? true,
  });
};
