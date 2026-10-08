"use client";

/**
 * 어드민 유저 사진 페이지 (부적절한 사진 검수용).
 * - 전체 유저가 직관 기록에 올린 사진을 최신 기록순으로 보여준다 (비공개 기록 포함).
 * - 상단 유저 필터로 한 유저의 사진만 볼 수 있다. 필터를 바꾸면 피드를 맨 위(최신 사진)부터 다시 보여준다.
 * - 유저 목록·닉네임 조회에 실패하면 필터 아래에 실패 문구와 다시 시도 버튼을 보여준다.
 */
import { Header } from "@/src/shared";

import { useUserPhotoFilter } from "../model/useUserPhotoFilter";
import RetryNotice from "./RetryNotice";
import UserPhotoFeed from "./UserPhotoFeed";
import UserPhotoFilter from "./UserPhotoFilter";

const UserPhotosPage = () => {
  const {
    selectedUserId,
    filterOptions,
    totalUserCount,
    isUploadersError,
    isUploadersFetching,
    isNicknamesError,
    isNicknamesFetching,
    getNickname,
    handleUserChange,
    handleRetryUploaders,
    handleRetryNicknames,
  } = useUserPhotoFilter();

  return (
    <div className="flex h-dvh flex-col">
      <Header
        className="mb-[12px] shrink-0"
        title={{ text: "유저 사진", position: "left" }}
        prevPage={{ href: "/admin" }}
      />
      <div className="flex shrink-0 flex-col gap-[8px] px-[16px] pb-[12px]">
        <UserPhotoFilter
          options={filterOptions}
          totalUserCount={totalUserCount}
          selectedUserId={selectedUserId}
          onUserChange={handleUserChange}
        />
        {isUploadersError && (
          <RetryNotice
            message="유저 목록을 불러오지 못했습니다."
            isRetrying={isUploadersFetching}
            onRetry={handleRetryUploaders}
          />
        )}
        {isNicknamesError && (
          <RetryNotice
            message="닉네임을 불러오지 못했습니다."
            isRetrying={isNicknamesFetching}
            onRetry={handleRetryNicknames}
          />
        )}
      </div>
      {/* key가 바뀌면 스크롤 영역을 새로 그려, 필터를 바꿨을 때 스크롤이 맨 위로 돌아간다. */}
      <div
        key={selectedUserId ?? "all"}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[16px] pb-[24px]"
      >
        <UserPhotoFeed
          selectedUserId={selectedUserId}
          getNickname={getNickname}
        />
      </div>
    </div>
  );
};

export default UserPhotosPage;
