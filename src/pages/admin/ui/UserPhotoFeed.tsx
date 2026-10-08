/**
 * 어드민 유저 사진 피드 (사진 그리드 + 무한 스크롤).
 * - 선택한 유저(없으면 전체 유저)의 사진을 최신 기록순으로 그린다.
 * - 로딩·조회 실패·사진 없음을 서로 구분해 보여주고, 실패하면 다시 시도 버튼을 띄운다.
 * - 사진 주소는 자동 갱신하지 않으므로, 피드 위에 만료 시 새로고침하라는 안내를 띄운다.
 */
import { getGameLogPhotoKey } from "@/src/entities";

import { useUserPhotoFeed } from "../model/useUserPhotoFeed";
import RetryNotice from "./RetryNotice";
import UserPhotoCard from "./UserPhotoCard";

interface UserPhotoFeedProps {
  selectedUserId?: string;
  getNickname: (userId: string) => string;
}

const UserPhotoFeed = ({ selectedUserId, getNickname }: UserPhotoFeedProps) => {
  const {
    photos,
    photoUrlValidMinutes,
    isPhotoFeedPending,
    isPhotoFeedFailed,
    isPhotoFeedFetching,
    isFetchingNextPhotoPage,
    isFetchNextPhotoPageError,
    loadMoreTriggerRef,
    handleRetryPhotoFeed,
    handleRetryNextPhotoPage,
  } = useUserPhotoFeed(selectedUserId);

  if (isPhotoFeedPending) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="text-white/60">로딩 중...</span>
      </div>
    );
  }

  if (isPhotoFeedFailed) {
    return (
      <RetryNotice
        message="사진을 불러오지 못했습니다."
        isRetrying={isPhotoFeedFetching}
        onRetry={handleRetryPhotoFeed}
        className="flex-1 justify-center"
      />
    );
  }

  if (!photos.length) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="text-white/60">업로드된 사진이 없습니다.</span>
      </div>
    );
  }

  return (
    <>
      <p className="pb-[8px] text-[12px] text-white/50">
        사진 주소는 연 뒤 {photoUrlValidMinutes}분이 지나면 만료됩니다. 사진이
        &quot;이미지 없음&quot;으로 바뀌면 새로고침해 주세요.
      </p>
      <div className="grid grid-cols-3 gap-[8px] sm:grid-cols-4">
        {photos.map((photo) => (
          <UserPhotoCard
            key={getGameLogPhotoKey(photo)}
            photo={photo}
            nickname={getNickname(photo.userId)}
          />
        ))}
      </div>
      <div ref={loadMoreTriggerRef} aria-hidden className="h-px shrink-0" />
      {isFetchingNextPhotoPage && (
        <div className="py-[16px] text-center text-[14px] text-white/60">
          불러오는 중...
        </div>
      )}
      {/* 다시 시도 중에는 위 "불러오는 중..."이 대신 보이므로 이 안내는 숨긴다. */}
      {isFetchNextPhotoPageError && !isFetchingNextPhotoPage && (
        <RetryNotice
          message="다음 사진을 불러오지 못했습니다."
          onRetry={handleRetryNextPhotoPage}
          className="py-[16px]"
        />
      )}
    </>
  );
};

export default UserPhotoFeed;
