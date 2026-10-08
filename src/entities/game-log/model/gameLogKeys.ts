/** 직관 기록 관련 react-query 키 스코프. */
export const gameLogKeys = {
  all: ["game_logs"] as const,
  photos: () => [...gameLogKeys.all, "photos"] as const,
  photoUploaders: () => [...gameLogKeys.photos(), "uploaders"] as const,
  photoFeed: (userId?: string) =>
    [...gameLogKeys.photos(), "feed", userId ?? "all"] as const,
} as const;
