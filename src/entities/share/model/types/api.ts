import { Database } from "@/src/shared";

export interface CreateShareQueryModel {
  body: Database["public"]["Tables"]["share"]["Insert"];
}

export type ShareServerModel = Database["public"]["Tables"]["share"]["Row"];

export interface GetShareDetailQueryModel {
  query: { shareId: number };
}

export interface UpdateShareAttendeesQueryModel {
  query: { shareId: number };
  body: { attendee_user_ids: string[] };
}

export interface UpdateShareQueryModel {
  query: { shareId: number };
  body: Database["public"]["Tables"]["share"]["Update"];
}

export interface DeleteShareQueryModel {
  query: { shareId: number };
}
