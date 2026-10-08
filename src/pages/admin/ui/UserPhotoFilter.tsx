/**
 * 어드민 유저 사진 피드의 유저 필터.
 * - "전체 유저" 또는 사진을 올린 유저 한 명을 고른다 (목록은 최근 기록순).
 * - 전체 인원 수는 목록을 불러온 뒤에만 표시한다 (로딩·실패를 "0명"으로 오해하지 않도록).
 */
import { formatNumber } from "@/src/shared";

import { UserPhotoFilterOption } from "../model/useUserPhotoFilter";

interface UserPhotoFilterProps {
  options: UserPhotoFilterOption[];
  totalUserCount?: number;
  selectedUserId?: string;
  onUserChange: (userId?: string) => void;
}

const UserPhotoFilter = ({
  options,
  totalUserCount,
  selectedUserId,
  onUserChange,
}: UserPhotoFilterProps) => {
  const allUsersLabel =
    totalUserCount === undefined
      ? "전체 유저"
      : `전체 유저 (${formatNumber(totalUserCount)}명)`;

  return (
    <select
      aria-label="유저 필터"
      value={selectedUserId ?? ""}
      onChange={(e) => onUserChange(e.target.value || undefined)}
      className="h-[44px] w-full rounded-[12px] border border-white/10 bg-white/4 px-[12px] text-[14px] text-white"
    >
      <option value="" className="bg-[#0a0a0a]">
        {allUsersLabel}
      </option>
      {options.map((option) => (
        <option
          key={option.userId}
          value={option.userId}
          className="bg-[#0a0a0a]"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default UserPhotoFilter;
