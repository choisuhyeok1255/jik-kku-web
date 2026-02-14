import { CreateGameLogQueryModel, GameLogServerModel } from "@/src/entities";
import { CreateGameLogForm, UpdateGameLogForm } from "../model/types/form";

export const transformFormToApiBody = (
  userId: string,
  formData:
    | Omit<CreateGameLogForm, "gameLogImage">
    | Omit<UpdateGameLogForm, "gameLogImage">,
  gameLogImage?: string,
): CreateGameLogQueryModel["body"] => {
  if (
    !formData.homeTeamId ||
    !formData.awayTeamId ||
    !formData.homeTeamScore ||
    !formData.awayTeamScore ||
    !formData.matchDate
  ) {
    throw new Error("Invalid form data");
  }

  return {
    user_id: userId,
    home_team_id: formData.homeTeamId,
    away_team_id: formData.awayTeamId,
    home_team_score: formData.homeTeamScore,
    away_team_score: formData.awayTeamScore,
    match_date: formData.matchDate,
    companion: formData.companion,
    mvp: formData.mvp,
    note: formData.note,
    is_certify: false,
    ...(gameLogImage && { game_log_image: gameLogImage }),
    stadium_id: formData.stadiumId ?? null,
    ...(formData.weather && { weather: Number(formData.weather) }),
  };
};

export const transformApiToForm = (
  gameLog: GameLogServerModel,
): CreateGameLogForm | UpdateGameLogForm => {
  return {
    stadiumId: gameLog.stadium_id,
    homeTeamId: gameLog.home_team_id,
    awayTeamId: gameLog.away_team_id,
    homeTeamScore: gameLog.home_team_score,
    awayTeamScore: gameLog.away_team_score,
    matchDate: gameLog.match_date,
    companion: gameLog.companion || "",
    mvp: gameLog.mvp || "",
    note: gameLog.note || "",
    weather: gameLog.weather?.toString() || null,
    gameLogImage: gameLog.game_log_image,
  };
};
