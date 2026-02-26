"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useGetStadiums, useGetTeams } from "@/src/entities";
import { MatchResultTag, useGetSignedUrl } from "@/src/shared";
import CertifiedIcon from "@/public/certified.svg";

const GameLogsItem = ({
  gameLog,
  enterDelay = 0,
  animate = true,
}: {
  gameLog: {
    game_log_id: number;
    home_team_score: number;
    away_team_score: number;
    home_team_id: number;
    away_team_id: number;
    match_date: string;
    game_log_image_thumbnail: string;
    note: string;
    is_certified: boolean;
    is_admin_certified: boolean;
    stadium_id: number | null;
  };
  enterDelay?: number;
  /** false면 카드 등장 애니메이션 없음 (무한스크롤 로드 항목용) */
  animate?: boolean;
}) => {
  const { mutateAsync: getSignedUrl } = useGetSignedUrl();
  const { data: teams } = useGetTeams();
  const { data: stadiums } = useGetStadiums();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const getResult = () => {
    if (
      typeof gameLog.home_team_score !== "number" ||
      typeof gameLog.away_team_score !== "number"
    )
      return null;

    if (gameLog.home_team_score > gameLog.away_team_score) return true;
    if (gameLog.home_team_score < gameLog.away_team_score) return false;
    return null;
  };

  const getHomeTeamName = () => {
    const homeTeam = teams?.find((team) => team.id === gameLog.home_team_id);
    return homeTeam?.team_name;
  };

  const getAwayTeamName = () => {
    const awayTeam = teams?.find((team) => team.id === gameLog.away_team_id);
    return awayTeam?.team_name;
  };

  const getStadiumName = () =>
    gameLog.stadium_id
      ? (stadiums?.find((s) => s.id === gameLog.stadium_id)?.name ?? null)
      : null;

  useEffect(() => {
    setImageUrl(null);
  }, [gameLog.game_log_image_thumbnail]);

  useEffect(() => {
    if (!gameLog.game_log_image_thumbnail) {
      setIsImageLoading(false);
      return;
    }
    if (!isFlipped || imageUrl) return;

    setIsImageLoading(true);
    const fetchSignedUrl = async () => {
      try {
        const { signedUrl } = await getSignedUrl({
          bucket: "game-log-images-thumbnail",
          path: gameLog.game_log_image_thumbnail!,
        });
        setImageUrl(signedUrl);
        // isImageLoading은 Image onLoad에서 false로 설정 (실제 이미지 로드 완료 시)
      } catch (error) {
        console.error("Signed URL 생성 실패:", error);
        setImageUrl(null);
        setIsImageLoading(false);
      }
    };

    fetchSignedUrl();
  }, [isFlipped, gameLog.game_log_image_thumbnail, getSignedUrl, imageUrl]);

  const cardBaseClass =
    "rounded-[20px] border border-white/10 bg-white/4 p-[20px]";

  return (
    <div
      id={`game-log-${gameLog.game_log_id}`}
      className={`flip-card cursor-pointer ${animate ? "card-enter" : ""}`}
      style={animate ? { animationDelay: `${enterDelay}ms` } : undefined}
      onClick={() => setIsFlipped((prev) => !prev)}
    >
      <div className={`flip-card-inner ${isFlipped ? "is-flipped" : ""}`}>
        {/* 앞면 */}
        <div className={`flip-card-front ${cardBaseClass}`}>
          <div className="mb-[12px] flex justify-between">
            <div className="flex flex-col gap-[4px]">
              <div className="flex items-center gap-[4px]">
                <div>{gameLog.match_date}</div>
                <div>
                  {gameLog.is_certified && (
                    <div className="flex items-center gap-[4px]">
                      <CertifiedIcon />
                      <div className="text-[12px] text-[#5724F0]">
                        인증 완료
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>{getStadiumName() ?? "-"}</div>
            </div>
            <MatchResultTag isVictory={getResult()} />
          </div>
          <div className="flex justify-around border-t border-b border-white/30 py-[20px]">
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
        </div>

        {/* 뒷면 */}
        <div
          className={`flip-card-back ${cardBaseClass} relative flex flex-col overflow-y-auto`}
        >
          {/* 수정하기 - absolute로 띄움 (전면 승리/패배 위치) */}
          <Link
            href={`/game-logs/${gameLog.game_log_id}/edit`}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-[20px] right-[20px] z-10 text-[14px] font-bold text-white transition-opacity hover:opacity-80"
          >
            수정하기
          </Link>

          {/* 사진 + 메모 (전체 높이 사용) */}
          <div className="flex min-h-0 flex-1 gap-[12px]">
            {/* 사진 영역 - 높이 꽉 채움 */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[12px] bg-white/5">
              {imageUrl ? (
                <div className="relative min-h-[100px] w-full flex-1">
                  <Image
                    src={imageUrl}
                    alt="직관 사진"
                    fill
                    className="object-cover"
                    onLoad={() => setIsImageLoading(false)}
                    onError={() => setIsImageLoading(false)}
                  />
                  {isImageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                      <span className="text-[14px] text-white/40">
                        로딩 중...
                      </span>
                    </div>
                  )}
                </div>
              ) : isImageLoading ? (
                <div className="flex flex-1 items-center justify-center">
                  <span className="text-[14px] text-white/40">로딩 중...</span>
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <span className="text-[14px] text-white/30">
                    사진이 없어요.
                  </span>
                </div>
              )}
            </div>

            {/* 메모 영역 - 수정하기 버튼 아래로 */}
            <div className="mt-[22px] flex min-h-[100px] min-w-0 flex-1 overflow-y-auto">
              {gameLog.note && (
                <p className="text-[14px] wrap-break-word text-white/90">
                  {gameLog.note}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLogsItem;
