import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/src/shared";

import type { GetKboEventsByDayQueryModel, KboEventRow } from "../model/types/api";

/** Supabase `kbo_events_cache`에서 일 단위(키=id) KBO 이벤트 JSON을 읽어옵니다. */
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
