interface BaseGameLogForm {
  homeTeamId: number | null;
  homeTeamScore: number | null;
  awayTeamId: number | null;
  awayTeamScore: number | null;
  matchDate: string | null;
  companion: string;
  mvp: string;
  note: string;
  weather: string | null;
  stadiumId: number | null;
}

export interface CreateGameLogForm extends BaseGameLogForm {
  gameLogImage: FileList | null;
}

export interface UpdateGameLogForm extends BaseGameLogForm {
  gameLogImage: FileList | string | null;
}
