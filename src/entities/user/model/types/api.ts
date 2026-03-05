import { Database } from "@/src/shared";

export interface GetUsersByIdsQueryModel {
  query: { userIds: string[] };
}

export type UserNicknameModel = Pick<
  Database["public"]["Tables"]["users"]["Row"],
  "id" | "nickname"
>;

export interface UpdateUserQueryModel {
  body: {
    nickname?: Database["public"]["Tables"]["users"]["Row"]["nickname"];
    avatar?: Database["public"]["Tables"]["users"]["Row"]["avatar"];
  };
}

export type UserServerModel = Database["public"]["Tables"]["users"]["Row"];

export interface UpdateTeamQueryModel {
  body: { team_id: Database["public"]["Tables"]["users"]["Row"]["team_id"] };
}

export type UpdateTeamQueryResponseModel =
  Database["public"]["Tables"]["users"]["Row"];
