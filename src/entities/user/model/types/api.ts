import { Database } from "@/src/shared";

export interface UpdateNicknameQueryModel {
  body: { nickname: Database["public"]["Tables"]["users"]["Row"]["nickname"] };
}

export type UserServerModel = Database["public"]["Tables"]["users"]["Row"];
