import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/shared";
import { TeamServerModel } from "../model/types/api";

export const useGetTeams = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data } = await supabase.from("teams").select("*");

      return data as TeamServerModel[];
    },
    select: (data) =>
      data.sort((a, b) => a.team_name.localeCompare(b.team_name)),
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
