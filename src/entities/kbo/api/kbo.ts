import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import { supabase } from "@/src/shared";
import type { Json } from "@/src/shared/lib/supabase.types";

import type {
  AddKboEventQueryModel,
  GetKboEventsByDayQueryModel,
  GetKboEventsQueryModel,
  KboEventRow,
  KboTeamRow,
} from "../model/types/api";

const THE_SPORTS_DB_BASE =
  process.env.NEXT_PUBLIC_THE_SPORTS_DB_BASE ??
  "https://www.thesportsdb.com/api/v1/json/123";
/**
 * TheSportsDB `idLeague`(Korean KBO League). `eventsday`의 `l`에 이름 대신 id 사용(문서도 id 예: 4424).
 * @see https://www.thesportsdb.com/documentation#schedule_v1 — Schedule Day
 */
const KBO_LEAGUE_ID = process.env.NEXT_PUBLIC_KBO_LEAGUE_ID ?? "4830";
/** Schedule Day 옵션 `s`(문서 예: `s=Baseball`). KBO는 야구 리그. */
const KBO_STR_SPORT = "Baseball";
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

/**
 * v1 API Schedule — Schedule Day: `eventsday.php?d&[s]&[l]`
 * (Search `searchevents`가 아님)
 */
export const getKboEventsByDate = async (
  date: string,
): Promise<KboEventRow[]> => {
  const d = dayjs(date).format("YYYY-MM-DD");
  const q = new URLSearchParams();
  q.set("d", d);
  q.set("s", KBO_STR_SPORT);
  q.set("l", KBO_LEAGUE_ID);
  const res = await fetch(
    `${THE_SPORTS_DB_BASE}/eventsday.php?${q.toString()}`,
  );
  if (!res.ok) {
    throw new Error(
      `TheSportsDB eventsday 실패: HTTP ${res.status} (${d}, l=${KBO_LEAGUE_ID})`,
    );
  }
  const data = (await res.json()) as {
    events?: KboEventRow[];
    Message?: string;
  };
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
