/**
 * 직관 기록 사진 데이터 변환 유틸.
 * - 기록 목록을 유저별 사진 요약으로 묶는다 (어드민 유저 필터용).
 * - 기록 목록 + 서명 URL을 화면에 그릴 사진 단위 목록으로 펼친다.
 * - 사진 한 장의 식별 키를 만들고, 페이지 경계가 밀려 겹친 사진을 하나로 줄인다.
 */
import { toTimestamp } from "@/src/shared";

import {
  GameLogPhotoLogModel,
  GameLogPhotoModel,
  GameLogPhotoUploaderModel,
} from "../model/types/api";

/**
 * 사진이 있는 기록 목록을 유저별로 묶어 사진 수·최근 기록 시각을 구한다.
 * @returns 최근 기록 시각 내림차순으로 정렬된 유저 요약 목록
 */
export const groupPhotoUploaders = (
  logs: Pick<
    GameLogPhotoLogModel,
    "user_id" | "game_log_images" | "created_at"
  >[],
): GameLogPhotoUploaderModel[] => {
  const byUser = new Map<string, GameLogPhotoUploaderModel>();

  for (const log of logs) {
    const prev = byUser.get(log.user_id);
    if (!prev) {
      byUser.set(log.user_id, {
        userId: log.user_id,
        photoCount: log.game_log_images.length,
        latestLoggedAt: log.created_at,
      });
      continue;
    }
    prev.photoCount += log.game_log_images.length;
    if (toTimestamp(log.created_at) > toTimestamp(prev.latestLoggedAt)) {
      prev.latestLoggedAt = log.created_at;
    }
  }

  return [...byUser.values()].sort(
    (a, b) => toTimestamp(b.latestLoggedAt) - toTimestamp(a.latestLoggedAt),
  );
};

/**
 * 기록 목록을 사진 한 장 단위로 펼치고 경로별 서명 URL을 붙인다.
 * @param signedUrlByPath 스토리지 경로 → 서명 URL (발급 실패한 경로는 없음)
 */
export const toGameLogPhotos = (
  logs: GameLogPhotoLogModel[],
  signedUrlByPath: Map<string, string>,
): GameLogPhotoModel[] =>
  logs.flatMap((log) =>
    log.game_log_images.map((path) => ({
      path,
      signedUrl: signedUrlByPath.get(path),
      logId: log.id,
      userId: log.user_id,
      isPrivate: log.is_private,
      createdAt: log.created_at,
    })),
  );

/** 사진 한 장의 식별 키 (기록 id + 스토리지 경로). React key와 중복 판단에 함께 쓴다. */
export const getGameLogPhotoKey = (
  photo: Pick<GameLogPhotoModel, "logId" | "path">,
) => `${photo.logId}-${photo.path}`;

/**
 * 같은 사진(같은 식별 키)이 여러 번 있으면 처음 것만 남긴다.
 * offset 페이지네이션 중 새 기록이 끼어들면 다음 페이지에 이전 페이지 사진이 다시 오기 때문이다.
 */
export const uniqueGameLogPhotos = (
  photos: GameLogPhotoModel[],
): GameLogPhotoModel[] => {
  const seen = new Set<string>();
  return photos.filter((photo) => {
    const key = getGameLogPhotoKey(photo);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
