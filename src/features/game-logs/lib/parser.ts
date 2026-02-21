import { CreateGameLogQueryModel, GameLogServerModel } from "@/src/entities";
import { CreateGameLogForm, UpdateGameLogForm } from "../model/types/form";

export const transformFormToApiBody = (
  userId: string,
  formData:
    | Omit<CreateGameLogForm, "gameLogImage">
    | Omit<UpdateGameLogForm, "gameLogImage">,
  gameLogImage?: string,
  gameLogImageThumbnail?: string,
): CreateGameLogQueryModel["body"] => {
  return {
    user_id: userId,
    home_team_id: formData.homeTeamId,
    away_team_id: formData.awayTeamId,
    home_team_score: formData.homeTeamScore,
    away_team_score: formData.awayTeamScore,
    match_date: formData.matchDate,
    note: formData.note,
    stadium_id: formData.stadiumId,
    is_certify: false,
    ...(gameLogImage && { game_log_image: gameLogImage }),
    ...(gameLogImageThumbnail && {
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
  };
};
