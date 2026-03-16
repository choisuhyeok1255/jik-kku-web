import { useMutation, useQuery } from "@tanstack/react-query";

import { supabase } from "@/src/shared";
import { SITE_URL } from "@/src/shared/lib/site-url";
import type { Json } from "@/src/shared/lib/supabase.types";

import type {
  AddKboEventQueryModel,
  GetKboEventsByDayQueryModel,
  GetKboEventsQueryModel,
  KboEventRow,
  KboTeamRow,
} from "../model/types/api";

const THE_SPORTS_DB_BASE = "https://www.thesportsdb.com/api/v1/json/123";
const KBO_LEAGUE = "Korean%20KBO%20League";

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
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : SITE_URL;
  const res = await fetch(
    `${baseUrl}/api/kbo/events/date?date=${encodeURIComponent(date)}`,
  );
  const data = await res.json();
  return (data ?? []) as KboEventRow[];
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

export const useGetKboEventsByDay = (req: GetKboEventsByDayQueryModel) => {
  return useQuery({
    queryKey: ["kbo-events-by-day", req.day],
    queryFn: async () => {
      const { data } = await supabase
        .from("kbo_events_cache")
        .select("data")
        .eq("id", req.day)
        .maybeSingle();

      return (data?.data ?? []) as unknown as KboEventRow[];
    },
    enabled: !!req.day,
  });
};

export const useAddKboEvent = () => {
  return useMutation({
    mutationFn: async (req: AddKboEventQueryModel) => {
      const { error } = await supabase.from("kbo_events_cache").upsert({
        id: req.body.id,
        data: req.body.data as unknown as Json,
      });
      if (error) throw error;
    },
  });
};
