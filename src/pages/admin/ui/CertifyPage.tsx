"use client";

import Image from "next/image";
import {
  useCertifyGameLog,
  useGetNotCertifyGameLogs,
  useRejectGameLog,
} from "@/src/entities";
import { useEffect, useState } from "react";
import { useGetSignedUrl } from "@/src/shared";

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
  const { data: gameLogs } = useGetNotCertifyGameLogs();
  const { mutate: certifyGameLogMutate } = useCertifyGameLog();
  const { mutate: rejectGameLogMutate } = useRejectGameLog();

  return (
    <div className="flex h-screen flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-4">
        <div className="shrink-0">직관 인증 페이지</div>
        {gameLogs?.map((gameLog) => (
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
        ))}
      </div>
    </div>
  );
};

export default CertifyPage;
