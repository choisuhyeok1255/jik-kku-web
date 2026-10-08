/**
 * 직관 기록 사진 조회 훅 (어드민 사진 검수용).
 * - 사진을 올린 유저 요약 목록(최근 기록순)과, 최신순 사진 피드(더 보기 페이지네이션)를 제공한다.
 * - 사진 피드는 페이지를 한 목록으로 펼치고, 페이지 경계가 밀려 겹친 사진을 걸러서 돌려준다.
 * - 서명 URL은 자동으로 갱신하지 않는다 (유효 시간은 `SIGNED_URL_EXPIRES_IN`, 만료되면 새로고침으로 다시 받는다).
 */
import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

import {
  getGameLogPhotoFeedPage,
  getGameLogPhotoUploaders,
} from "../api/gameLog";
import { uniqueGameLogPhotos } from "../lib/gameLogPhoto";
import { gameLogKeys } from "./gameLogKeys";
import {
  GameLogPhotoPageModel,
  GetGameLogPhotoFeedQueryModel,
} from "./types/api";

/** 사진을 올린 유저 요약 목록 조회 (최근 기록순). */
export const useGetGameLogPhotoUploaders = () => {
  return useQuery({
    queryKey: gameLogKeys.photoUploaders(),
    queryFn: getGameLogPhotoUploaders,
  });
};

/** 불러온 페이지들을 사진 한 목록으로 펼치고 중복을 거른다. (참조가 고정되도록 훅 밖에 둔다) */
const selectUniquePhotos = (data: InfiniteData<GameLogPhotoPageModel>) =>
  uniqueGameLogPhotos(data.pages.flatMap((page) => page.photos));

/** 사진 피드 조회 (최신 기록순, 비공개 기록 포함). `userId`가 있으면 그 유저의 사진만. */
export const useGetGameLogPhotoFeed = (req: GetGameLogPhotoFeedQueryModel) => {
  const { userId } = req.query;

  return useInfiniteQuery({
    queryKey: gameLogKeys.photoFeed(userId),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getGameLogPhotoFeedPage({ query: { userId, page: pageParam } }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length : undefined,
    select: selectUniquePhotos,
  });
};
