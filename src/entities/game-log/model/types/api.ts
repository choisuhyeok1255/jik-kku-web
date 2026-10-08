import { Database } from "@/src/shared";

type GameLogRow = Database["public"]["Tables"]["game_logs"]["Row"];

/** 사진 검수용으로 조회하는 직관 기록 한 행 (사진이 있는 기록만, 필요한 컬럼만). */
export type GameLogPhotoLogModel = Pick<
  GameLogRow,
  "id" | "user_id" | "game_log_images" | "is_private" | "created_at"
>;

/** 피드에 표시할 사진 한 장. 서명 URL 발급에 실패한(파일이 없는 등) 사진은 `signedUrl`이 없다. */
export interface GameLogPhotoModel {
  path: string;
  signedUrl?: string;
  logId: number;
  userId: string;
  isPrivate: boolean;
  createdAt: string;
}

/** 사진 피드 한 페이지. */
export interface GameLogPhotoPageModel {
  photos: GameLogPhotoModel[];
  hasMore: boolean;
}

/** 사진을 올린 유저 요약 (유저 필터 목록용). */
export interface GameLogPhotoUploaderModel {
  userId: string;
  photoCount: number;
  latestLoggedAt: string;
}

/** 사진 피드 조회 요청. `userId`가 없으면 전체 유저의 사진을 조회한다. */
export interface GetGameLogPhotoFeedQueryModel {
  query: { userId?: string };
}

/** 사진 피드 한 페이지 조회 요청. `page`는 0부터 시작한다. */
export interface GetGameLogPhotoFeedPageQueryModel {
  query: GetGameLogPhotoFeedQueryModel["query"] & { page: number };
}
