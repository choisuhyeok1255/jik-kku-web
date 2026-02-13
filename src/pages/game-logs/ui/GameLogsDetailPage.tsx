"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetGameLogDetail, useGetTeams } from "@/src/entities";
import { useGetSignedUrl } from "@/src/shared";

const GameLogDetailPage = () => {
  const { id } = useParams<{ id: string | undefined }>();

  const { data: gameLogDetail } = useGetGameLogDetail({
    query: { gameLogId: Number(id) },
  });
  const { data: teams } = useGetTeams();
  const { mutateAsync: getSignedUrl } = useGetSignedUrl();

  const homeTeamName = teams?.find(
    ({ id }) => id === gameLogDetail?.home_team_id
  )?.team_name;
  const awayTeamName = teams?.find(
    ({ id }) => id === gameLogDetail?.away_team_id
  )?.team_name;

  // Signed URL 생성 (비공개 버킷용)
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!gameLogDetail) return;

    const fetchSignedUrl = async () => {
      if (gameLogDetail.game_log_image) {
        try {
          const { signedUrl } = await getSignedUrl({
            bucket: "game-log-images",
            path: gameLogDetail.game_log_image,
          });
          setImageUrl(signedUrl);
        } catch (error) {
          console.error("Signed URL 생성 실패:", error);
          setImageUrl(null);
        }
      }
    };

    fetchSignedUrl();
  }, [gameLogDetail, getSignedUrl]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 p-4">
      <h2>
        {homeTeamName} vs {awayTeamName}
      </h2>
      <h2>
        {gameLogDetail?.home_team_score} : {gameLogDetail?.away_team_score}
      </h2>
      <h2>경기일자: {gameLogDetail?.match_date}</h2>
      <h2>동행자: {gameLogDetail?.companion}</h2>
      <h2>MVP: {gameLogDetail?.mvp}</h2>
      <h2>메모: {gameLogDetail?.note}</h2>
      {imageUrl && (
        <Image src={imageUrl} alt="gameLogImage" width={100} height={100} />
      )}
      <div className="flex gap-4 justify-center">
        <Link href="/">홈으로</Link>
        <Link href={`game-logs/${id}/edit`}>수정</Link>
      </div>
    </div>
  );
};

export default GameLogDetailPage;
