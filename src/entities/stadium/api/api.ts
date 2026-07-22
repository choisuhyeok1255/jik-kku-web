import { supabase } from "@/src/shared";

import { StadiumServerModel } from "../model/types/api";

export const getStadiums = async () => {
  const { data } = await supabase.from("stadium").select("*");
  return data as StadiumServerModel[];
};
