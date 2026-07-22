export interface UpdateInquiryAnswerQueryModel {
  query: { inquiryId: number };
  body: { answer: string };
}
