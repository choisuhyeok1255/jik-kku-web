/**
 * 어드민 유저 사진 피드의 사진 카드.
 * - 사진을 누르면 원본이 새 탭에서 열린다.
 * - 비공개 기록의 사진에는 "비공개" 배지를 붙인다.
 * - 서명 URL이 없거나(파일 없음) 로드에 실패하면 "이미지 없음"을 표시한다.
 *   실패는 URL 단위로 기억하므로, 피드를 다시 받아 새 서명 URL이 오면 다시 불러온다.
 */
import { useState } from "react";

import { GameLogPhotoModel } from "@/src/entities";
import { formatDate } from "@/src/shared";

interface UserPhotoCardProps {
  photo: GameLogPhotoModel;
  nickname: string;
}

const UserPhotoCard = ({ photo, nickname }: UserPhotoCardProps) => {
  const [failedUrl, setFailedUrl] = useState<string>();
  const hasLoadError = !!photo.signedUrl && failedUrl === photo.signedUrl;

  return (
    <figure className="overflow-hidden rounded-[12px] border border-white/10 bg-white/4">
      <div className="relative aspect-square">
        {photo.signedUrl && !hasLoadError ? (
          <a href={photo.signedUrl} target="_blank" rel="noopener noreferrer">
            {/* 서명 URL은 발급할 때마다 바뀌어 next/image 최적화 캐시가 맞지 않으므로 img를 쓴다. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.signedUrl}
              alt={`${nickname}님이 올린 직관 사진`}
              loading="lazy"
              onError={() => setFailedUrl(photo.signedUrl)}
              className="size-full object-cover"
            />
          </a>
        ) : (
          <div className="flex size-full items-center justify-center text-[12px] text-white/40">
            이미지 없음
          </div>
        )}
        {photo.isPrivate && (
          <span className="absolute top-[6px] left-[6px] rounded-[6px] bg-black/70 px-[6px] py-[2px] text-[11px] font-medium text-white">
            비공개
          </span>
        )}
      </div>
      <figcaption className="px-[8px] py-[6px] text-[12px]">
        <div className="truncate text-white/90">{nickname}</div>
        <div className="text-white/50">{formatDate(photo.createdAt)}</div>
      </figcaption>
    </figure>
  );
};

export default UserPhotoCard;
