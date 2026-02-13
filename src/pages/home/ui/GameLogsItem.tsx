"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { useGetTeams } from "@/src/entities";
import { useGetSignedUrl } from "@/src/shared";

const GameLogsItem = ({
  gameLog,
}: {
  gameLog: {
    home_team_score: number;
    away_team_score: number;
    home_team_id: number;
    away_team_id: number;
    match_date: string;
    game_log_image: string;
    note: string;
    is_certify: boolean;
  };
}) => {
  const { mutateAsync: getSignedUrl } = useGetSignedUrl();
  const { data: teams } = useGetTeams();

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const getResult = () => {
    if (!gameLog.home_team_score || !gameLog.away_team_score) return "";

    if (gameLog.home_team_score > gameLog.away_team_score) return "승리";
    if (gameLog.home_team_score < gameLog.away_team_score) return "패배";
    return "무승부";
  };

  const getHomeTeamName = () => {
    const homeTeam = teams?.find((team) => team.id === gameLog.home_team_id);
    return homeTeam?.team_name;
  };

  const getAwayTeamName = () => {
    const awayTeam = teams?.find((team) => team.id === gameLog.away_team_id);
    return awayTeam?.team_name;
  };

  useEffect(() => {
    if (!gameLog.game_log_image) {
      setImageUrl(null);
      return;
    }

    const fetchSignedUrl = async () => {
      try {
        const { signedUrl } = await getSignedUrl({
          bucket: "game-log-images",
          path: gameLog.game_log_image!,
        });
        setImageUrl(signedUrl);
      } catch (error) {
        console.error("Signed URL 생성 실패:", error);
        setImageUrl(null);
      }
    };

    fetchSignedUrl();
  }, [gameLog.game_log_image, getSignedUrl]);

  return (
    <div className="rounded-[20px] border border-white/10 bg-white/4 p-[20px]">
      <div className="mb-[12px] flex justify-between">
        <div className="flex flex-col gap-[4px]">
          <div className="flex gap-[4px]">
            <div>{gameLog.match_date}</div>
            <div>{gameLog.is_certify && "인증"}</div>
          </div>
          <div>잠실야구장</div>
        </div>
        <div>{getResult()}</div>
      </div>
      <div className="mb-[12px] flex justify-around border-t border-b border-white/30 py-[20px]">
        <div className="flex flex-col items-center gap-[8px]">
          <div>{getHomeTeamName()}</div>
          <div>{gameLog.home_team_score}</div>
        </div>
        <div>VS</div>
        <div className="flex flex-col items-center gap-[8px]">
          <div>{getAwayTeamName()}</div>
          <div>{gameLog.away_team_score}</div>
        </div>
      </div>
      <div className="flex gap-[12px]">
        {imageUrl && (
          <Image
            className="rounded-[10px]"
            src={imageUrl}
            alt="gameLogImage"
            width={60}
            height={60}
          />
        )}
        {gameLog.note && <div>{gameLog.note}</div>}
      </div>
    </div>
  );
};

export default GameLogsItem;
