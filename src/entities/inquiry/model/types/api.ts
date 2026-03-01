import { Database } from "@/src/shared";

export type InquiryServerModel = Database["public"]["Tables"]["inquiries"]["Row"];

export interface CreateInquiryQueryModel {
  body: Pick<
    Database["public"]["Tables"]["inquiries"]["Insert"],
    "title" | "content" | "user_id"
  >;
}

export interface GetMyInquiriesQueryModel {
  query: { userId: string };
}

export interface UpdateInquiryAnswerQueryModel {
  query: { inquiryId: number };
  body: { answer: string };
}
