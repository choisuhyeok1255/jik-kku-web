/**
 * 직관 기록(game_logs) 사진 조회 API (어드민 사진 검수용).
 * - 사진을 올린 유저 요약 조회, 최신순 사진 피드 한 페이지 조회를 제공한다.
 * - 두 함수 모두 DB 원본 행이 아니라 화면용 모델로 바꿔서 돌려준다.
 * - 사진은 비공개 버킷에 있으므로 서명 URL(일정 시간만 열리는 임시 주소)을 발급해 붙인다.
 */
import { supabase } from "@/src/shared";

import { SIGNED_URL_EXPIRES_IN } from "../config/photo";
import { groupPhotoUploaders, toGameLogPhotos } from "../lib/gameLogPhoto";
import {
  GameLogPhotoPageModel,
  GameLogPhotoUploaderModel,
  GetGameLogPhotoFeedPageQueryModel,
} from "../model/types/api";

const GAME_LOG_IMAGES_BUCKET = "game-log-images";
/** 피드 한 페이지에 불러올 기록 수 (기록 1건에 사진이 여러 장일 수 있음). */
const PHOTO_FEED_PAGE_SIZE = 20;
/** 사진 배열이 빈 기록(`{}`)을 제외하기 위한 비교값. */
const EMPTY_IMAGES = "{}";

/** 스토리지 경로 목록의 서명 URL을 한 번에 발급해 경로 → URL 맵으로 돌려준다. */
const createSignedUrlMap = async (paths: string[]) => {
  if (!paths.length) return new Map<string, string>();

  const { data, error } = await supabase.storage
    .from(GAME_LOG_IMAGES_BUCKET)
    .createSignedUrls(paths, SIGNED_URL_EXPIRES_IN);
  if (error) throw error;

  // 파일이 지워진 경로 등은 항목별 error로 오므로 맵에서 빼고, 화면에서 "이미지 없음"으로 처리한다.
  return new Map(
    data.flatMap((item) =>
      item.path && !item.error ? [[item.path, item.signedUrl] as const] : [],
    ),
  );
};

/** 사진을 올린 유저 요약 조회 (최근 기록순). 사진이 있는 기록 전체를 필요한 컬럼만 받아 유저별로 묶는다. */
export const getGameLogPhotoUploaders = async (): Promise<
  GameLogPhotoUploaderModel[]
> => {
  const { data, error } = await supabase
    .from("game_logs")
    .select("user_id, game_log_images, created_at")
    .filter("game_log_images", "neq", EMPTY_IMAGES);

  if (error) throw error;
  return groupPhotoUploaders(data ?? []);
};

/** 사진 피드 한 페이지 조회 (최신 기록순, 비공개 기록 포함). `userId`가 있으면 그 유저의 사진만. */
export const getGameLogPhotoFeedPage = async (
  req: GetGameLogPhotoFeedPageQueryModel,
): Promise<GameLogPhotoPageModel> => {
  const { userId, page } = req.query;
  const from = page * PHOTO_FEED_PAGE_SIZE;

  let query = supabase
    .from("game_logs")
    .select("id, user_id, game_log_images, is_private, created_at")
    .filter("game_log_images", "neq", EMPTY_IMAGES)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(from, from + PHOTO_FEED_PAGE_SIZE - 1);
  if (userId) query = query.eq("user_id", userId);

  const { data, error } = await query;
  if (error) throw error;

  const logs = data ?? [];
  const signedUrlByPath = await createSignedUrlMap(
    logs.flatMap((log) => log.game_log_images),
  );
  return {
    photos: toGameLogPhotos(logs, signedUrlByPath),
    hasMore: logs.length === PHOTO_FEED_PAGE_SIZE,
  };
};
