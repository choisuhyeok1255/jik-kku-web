import { CreateGameLogQueryModel, GameLogServerModel } from "@/src/entities";
import { CreateGameLogForm, UpdateGameLogForm } from "../model/types/form";

export const transformFormToApiBody = ({
  userId,
  formData,
  gameLogImage,
  gameLogImageThumbnail,
  isCertified,
  isAdminCertified,
}: {
  userId: string;
  formData:
    | Omit<CreateGameLogForm, "gameLogImage">
    | Omit<UpdateGameLogForm, "gameLogImage">;
  isCertified?: boolean;
  isAdminCertified?: boolean;
  gameLogImage?: string | null;
  gameLogImageThumbnail?: string | null;
}): CreateGameLogQueryModel["body"] => {
  if (
    formData.homeTeamId == null ||
    formData.awayTeamId == null ||
    formData.homeTeamScore == null ||
    formData.awayTeamScore == null ||
    formData.matchDate == null ||
    formData.stadiumId == null
  ) {
    throw new Error("Required fields are missing");
  }

  return {
    user_id: userId,
    home_team_id: formData.homeTeamId,
    away_team_id: formData.awayTeamId,
    home_team_score: formData.homeTeamScore,
    away_team_score: formData.awayTeamScore,
    match_date: formData.matchDate,
    note: formData.note,
    stadium_id: formData.stadiumId,
    youtube_url: formData.youtubeUrl,
    support_team_id: formData.homeTeamId,
    game_log_images: [],
    is_private: false,
    game_record_id: null,
    ...(isCertified !== undefined && { is_certified: isCertified }),
    ...(isAdminCertified !== undefined && {
      is_admin_certified: isAdminCertified,
    }),
    ...(gameLogImage !== undefined && { game_log_image: gameLogImage }),
    ...(gameLogImageThumbnail !== undefined && {
      game_log_image_thumbnail: gameLogImageThumbnail,
    }),
  };
};

export const transformApiToGameLogForm = (
  gameLog: GameLogServerModel,
): CreateGameLogForm | UpdateGameLogForm => {
  return {
    stadiumId: gameLog.stadium_id,
    homeTeamId: gameLog.home_team_id,
    awayTeamId: gameLog.away_team_id,
    homeTeamScore: gameLog.home_team_score,
    awayTeamScore: gameLog.away_team_score,
    matchDate: gameLog.match_date,
    note: gameLog.note || "",
    gameLogImage: gameLog.game_log_image_thumbnail, // NOTE: 이미지 사용할땐 축소한 이미지로 사용
    youtubeUrl: gameLog.youtube_url,
  };
};
