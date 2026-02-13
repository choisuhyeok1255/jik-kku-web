"use client";

import Image from "next/image";
import {
  useCertifyGameLog,
  useGetNotCertifyGameLogs,
  useAuthStore,
} from "@/src/entities";
import { useEffect, useState } from "react";
import { useGetSignedUrl } from "@/src/shared";

const GameLogImage = ({ gameLogImage }: { gameLogImage: string }) => {
  const { mutateAsync: getSignedUrl } = useGetSignedUrl();

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!gameLogImage) {
      setImageUrl(null);
      return;
    }

    const fetchSignedUrl = async () => {
      try {
        const { signedUrl } = await getSignedUrl({
          bucket: "game-log-images",
          path: gameLogImage,
        });
        setImageUrl(signedUrl);
      } catch (error) {
        console.error("Signed URL 생성 실패:", error);
        setImageUrl(null);
      }
    };

    fetchSignedUrl();
  }, [gameLogImage, getSignedUrl]);

  if (!imageUrl) return null;

  return <Image src={imageUrl} alt="game log image" width={100} height={100} />;
};

const CertifyPage = () => {
  const { user } = useAuthStore();

  const { data: gameLogs } = useGetNotCertifyGameLogs({
    query: { userId: user?.id || "" },
  });
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
            {gameLog.game_log_image && (
              <GameLogImage gameLogImage={gameLog.game_log_image} />
            )}
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
