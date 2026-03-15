"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  useCertifyGameLog,
  useGetNotCertifyGameLogs,
  useRejectGameLog,
} from "@/src/entities";
import { Header, useGetSignedUrl } from "@/src/shared";

const GameLogImage = ({
  gameLogImage,
  gameLogImageThumbnail,
}: {
  gameLogImage?: string;
  gameLogImageThumbnail?: string;
}) => {
  const { mutateAsync: getSignedUrl } = useGetSignedUrl();

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!gameLogImage && !gameLogImageThumbnail) {
      setImageUrl(null);
      return;
    }

    const fetchSignedUrl = async () => {
      try {
        if (gameLogImageThumbnail) {
          const { signedUrl } = await getSignedUrl({
            bucket: "game-log-images-thumbnail",
            path: gameLogImageThumbnail,
          });
          setImageUrl(signedUrl);
        } else if (gameLogImage) {
          const { signedUrl } = await getSignedUrl({
            bucket: "game-log-images",
            path: gameLogImage,
          });
          setImageUrl(signedUrl);
        }
      } catch (error) {
        console.error("Signed URL 생성 실패:", error);
        setImageUrl(null);
      }
    };

    fetchSignedUrl();
  }, [gameLogImage, gameLogImageThumbnail, getSignedUrl]);

  if (!imageUrl) return null;

  return (
    <Image
      className="h-[100px] w-[100px] object-cover"
      src={imageUrl}
      alt="game log image"
      width={100}
      height={100}
    />
  );
};

const CertifyPage = () => {
  const { data: gameLogs, isLoading } = useGetNotCertifyGameLogs();
  const { mutate: certifyGameLogMutate } = useCertifyGameLog();
  const { mutate: rejectGameLogMutate } = useRejectGameLog();

  return (
    <div className="flex h-dvh flex-col">
      <Header
        className="mb-[12px] shrink-0"
        title={{ text: "직관 인증", position: "left" }}
        prevPage={{ href: "/admin" }}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-white/60">로딩 중...</span>
          </div>
        ) : !gameLogs?.length ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-white/60">인증 대기 중인 직관 기록이 없습니다.</span>
          </div>
        ) : (
          gameLogs.map((gameLog) => (
            <div
              key={gameLog.id}
              className="flex items-center justify-between rounded-md border-2 border-gray-300 p-4"
            >
              <GameLogImage
                gameLogImage={gameLog.game_log_image ?? undefined}
                gameLogImageThumbnail={
                  gameLog.game_log_image_thumbnail ?? undefined
                }
              />
              <div className="flex gap-[40px]">
                <button
                  className="h-[40px] w-[100px] rounded-md border-2 border-gray-300"
                  type="button"
                  onClick={() =>
                    certifyGameLogMutate({ query: { gameLogId: gameLog.id } })
                  }
                >
                  인증
                </button>
                <button
                  className="h-[40px] w-[100px] rounded-md border-2 border-gray-300"
                  type="button"
                  onClick={() =>
                    rejectGameLogMutate({ query: { gameLogId: gameLog.id } })
                  }
                >
                  반려
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CertifyPage;
