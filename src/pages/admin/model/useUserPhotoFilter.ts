/**
 * 어드민 유저 사진 화면의 유저 필터 상태.
 * - 선택한 유저(선택 없음 = 전체 유저)를 관리한다.
 * - 사진을 올린 유저 목록(최근 기록순)과 닉네임을 조회해 필터 옵션을 만든다.
 * - 목록·닉네임 조회 실패와 재시도 중 여부를 내보내, 화면이 실패를 "데이터 없음"과 구분하게 한다.
 */
import { useState } from "react";

import {
  getNicknameOrShortId,
  useGetGameLogPhotoUploaders,
  useGetUsersByIds,
} from "@/src/entities";
import { formatNumber } from "@/src/shared";

export interface UserPhotoFilterOption {
  userId: string;
  label: string;
}

export const useUserPhotoFilter = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>();

  const {
    data: uploadersData,
    isError: isUploadersError,
    isFetching: isUploadersFetching,
    refetch: refetchUploaders,
  } = useGetGameLogPhotoUploaders();
  const uploaders = uploadersData ?? [];
  const {
    data: users = [],
    isError: isNicknamesError,
    isFetching: isNicknamesFetching,
    refetch: refetchNicknames,
  } = useGetUsersByIds({
    query: { userIds: uploaders.map((uploader) => uploader.userId) },
  });

  const nicknameById = new Map(users.map((user) => [user.id, user.nickname]));
  const getNickname = (userId: string) =>
    getNicknameOrShortId(userId, nicknameById.get(userId));

  const filterOptions: UserPhotoFilterOption[] = uploaders.map((uploader) => ({
    userId: uploader.userId,
    label: `${getNickname(uploader.userId)} (${formatNumber(uploader.photoCount)}장)`,
  }));
  // 목록을 아직 못 받았으면(로딩·첫 조회 실패) "0명"으로 오해하지 않도록 인원 수를 숨긴다.
  const totalUserCount = uploadersData ? uploadersData.length : undefined;

  const handleUserChange = (userId?: string) => setSelectedUserId(userId);
  const handleRetryUploaders = () => refetchUploaders();
  const handleRetryNicknames = () => refetchNicknames();

  return {
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
  };
};
