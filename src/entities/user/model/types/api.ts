import { Database } from "@/src/shared";

export interface UpdateNicknameQueryModel {
  body: { nickname: Database["public"]["Tables"]["users"]["Row"]["nickname"] };
}

export type UserServerModel = Database["public"]["Tables"]["users"]["Row"];

export interface UpdateTeamQueryModel {
  body: { team_id: Database["public"]["Tables"]["users"]["Row"]["team_id"] };
}

export type UpdateTeamQueryResponseModel =
  Database["public"]["Tables"]["users"]["Row"];
