import { Database } from "@/src/shared";

/** 공지 작성 요청 모델. `title`, `content`만 클라이언트가 전달합니다. */
export interface CreateNoticeQueryModel {
  body: Pick<
    Database["public"]["Tables"]["notices"]["Insert"],
    "title" | "content"
  >;
}

/** 공지 수정 요청 모델. `updated_at`은 DB 트리거가 자동으로 갱신합니다. */
export interface UpdateNoticeQueryModel {
  query: { noticeId: number };
  body: { title: string; content: string };
}

/** 공지 삭제 요청 모델 (물리 삭제). */
export interface DeleteNoticeQueryModel {
  query: { noticeId: number };
}

/** 공지 단건 조회 요청 모델 (수정 페이지에서 사용). */
export interface GetNoticeByIdQueryModel {
  query: { noticeId: number };
}
