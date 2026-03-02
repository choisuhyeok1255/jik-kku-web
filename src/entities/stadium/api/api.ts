import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/shared";

import { StadiumServerModel } from "../model/types/api";

export const getStadiums = async () => {
  const { data } = await supabase.from("stadium").select("*");
  return data as StadiumServerModel[];
};

export const getTeamsWithStadium = async () => {
  const { data } = await supabase.from("teams").select(`
    id,
    short_team_name,
    team_name,
    team_logo,
    stadium_id,
    stadium:stadium_id (id,name)
  `);
  return data;
};

export const useGetStadiums = () => {
  return useQuery({
    queryKey: ["stadiums"],
    queryFn: getStadiums,
    select: (data) =>
      data
        .filter((item) => item.league_level === "first")
        .sort((a, b) => a.name?.localeCompare(b.name ?? "") ?? 0),
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const useGetTeamsWithStadium = () => {
  return useQuery({
    queryKey: ["teamsWithStadium"],
    queryFn: getTeamsWithStadium,
    select: (data) =>
      data?.sort(
        (a, b) => a.stadium?.name?.localeCompare(b.stadium?.name ?? "") ?? 0,
      ),
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
