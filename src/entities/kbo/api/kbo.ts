import { useQuery } from "@tanstack/react-query";

import type {
  GetKboEventsBySeasonQueryModel,
  GetKboEventsQueryModel,
  KboEventRow,
  KboTeamRow,
} from "../model/types/api";

const THE_SPORTS_DB_BASE = "https://www.thesportsdb.com/api/v1/json/123";
const KBO_LEAGUE = "Korean%20KBO%20League";
const KBO_LEAGUE_ID = "4830";

export const getKboTeams = async (): Promise<KboTeamRow[]> => {
  const res = await fetch(
    `${THE_SPORTS_DB_BASE}/search_all_teams.php?l=${KBO_LEAGUE}`,
  );
  const data = await res.json();
  return (data.teams ?? []) as KboTeamRow[];
};

export const useGetKboTeams = () => {
  return useQuery({
    queryKey: ["kbo-teams"],
    queryFn: getKboTeams,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const getKboEventsByDate = async (
  date: string,
): Promise<KboEventRow[]> => {
  const res = await fetch(
    `${THE_SPORTS_DB_BASE}/eventsday.php?d=${date}&l=${KBO_LEAGUE}`,
  );
  const data = await res.json();
  return (data.events ?? []) as KboEventRow[];
};

export const useGetKboEventsByDate = (req: GetKboEventsQueryModel) => {
  return useQuery({
    queryKey: ["kbo-events-by-date", req.date],
    queryFn: () => getKboEventsByDate(req.date),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: !!req.date,
  });
};

export const getKboEventsBySeason = async (
  season: string,
): Promise<KboEventRow[]> => {
  const res = await fetch(
    `${THE_SPORTS_DB_BASE}/eventsseason.php?id=${KBO_LEAGUE_ID}&s=${season}`,
  );
  const data = await res.json();
  return (data.events ?? []) as KboEventRow[];
};

export const useGetKboEventsBySeason = (
  req: GetKboEventsBySeasonQueryModel,
) => {
  return useQuery({
    queryKey: ["kbo-events-by-season", req.season],
    queryFn: () => getKboEventsBySeason(req.season),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: !!req.season,
  });
};
