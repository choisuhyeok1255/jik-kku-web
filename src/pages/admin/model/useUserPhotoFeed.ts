/**
 * 어드민 유저 사진 화면의 사진 피드 상태.
 * - 선택한 유저(없으면 전체 유저)의 사진을 최신 기록순으로 조회한다.
 * - 피드 끝의 센티넬이 화면에 보이면 다음 페이지를 불러온다 (무한 스크롤).
 * - 다음 페이지 요청이 실패하면 자동 요청을 멈추고, 재시도는 사용자가 직접 누르게 한다.
 * - 사진 주소(서명 URL)는 자동 갱신하지 않으므로, 유효 시간(분)을 내보내 화면이 새로고침 안내를 띄우게 한다.
 */
import { SIGNED_URL_EXPIRES_IN, useGetGameLogPhotoFeed } from "@/src/entities";
import { useInfiniteScroll } from "@/src/shared";

/** 사진 주소 유효 시간(분). 새로고침 안내 문구에 쓴다. */
const PHOTO_URL_VALID_MINUTES = SIGNED_URL_EXPIRES_IN / 60;

/** @param selectedUserId 사진을 볼 유저 id (없으면 전체 유저) */
export const useUserPhotoFeed = (selectedUserId?: string) => {
  const {
    data: photos = [],
    isPending: isPhotoFeedPending,
    isError: isPhotoFeedError,
    isFetching: isPhotoFeedFetching,
    refetch: refetchPhotoFeed,
    hasNextPage: hasNextPhotoPage,
    isFetchingNextPage: isFetchingNextPhotoPage,
    isFetchNextPageError: isFetchNextPhotoPageError,
    fetchNextPage: fetchNextPhotoPage,
  } = useGetGameLogPhotoFeed({ query: { userId: selectedUserId } });

  const isPhotoFeedFailed = isPhotoFeedError && !photos.length;

  const handleRetryPhotoFeed = () => refetchPhotoFeed();
  const handleRetryNextPhotoPage = () => fetchNextPhotoPage();
  // 조회 중(다음 페이지·전체 다시 받기 모두)에는 감지를 멈춘다.
  // 전체 다시 받기 중에 다음 페이지를 부르면 진행 중인 요청이 취소되기 때문이다.
  const loadMoreTriggerRef = useInfiniteScroll({
    enabled:
      hasNextPhotoPage && !isPhotoFeedFetching && !isFetchNextPhotoPageError,
    onLoadMore: fetchNextPhotoPage,
  });

  return {
    photos,
    photoUrlValidMinutes: PHOTO_URL_VALID_MINUTES,
    isPhotoFeedPending,
    isPhotoFeedFailed,
    isPhotoFeedFetching,
    isFetchingNextPhotoPage,
    isFetchNextPhotoPageError,
    loadMoreTriggerRef,
    handleRetryPhotoFeed,
    handleRetryNextPhotoPage,
  };
};
