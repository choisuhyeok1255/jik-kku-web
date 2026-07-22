import { Database } from "@/src/shared";

export interface GetUsersByIdsQueryModel {
  query: { userIds: string[] };
}

export type UserNicknameModel = Pick<
  Database["public"]["Tables"]["users"]["Row"],
  "id" | "nickname"
>;
