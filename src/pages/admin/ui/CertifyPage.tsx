"use client";

import Image from "next/image";
import { useCertifyGameLog, useGetNotCertifyGameLogs } from "@/src/entities";
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

  return <Image src={imageUrl} alt="game log image" width={100} height={100} />;
};

const CertifyPage = () => {
  const { data: gameLogs } = useGetNotCertifyGameLogs();
  const { mutate: certifyGameLogMutate } = useCertifyGameLog();

  return (
    <div>
      <div className="flex w-full flex-col gap-2">
        직관 인증 페이지
        {gameLogs?.map((gameLog) => (
          <div
            key={gameLog.id}
            className="flex w-[300px] items-center justify-between rounded-md border-2 border-gray-300 p-4"
          >
            <GameLogImage
              gameLogImage={gameLog.game_log_image ?? undefined}
              gameLogImageThumbnail={
                gameLog.game_log_image_thumbnail ?? undefined
              }
            />
            <div>{gameLog.match_date}</div>
            <button
              type="button"
              onClick={() =>
                certifyGameLogMutate({ query: { gameLogId: gameLog.id } })
              }
            >
              인증
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertifyPage;
