interface BaseGameLogForm {
  homeTeamId: number | null;
  homeTeamScore: number | null;
  awayTeamId: number | null;
  awayTeamScore: number | null;
  matchDate: string | null;
  note: string;
  stadiumId: number | null;
  youtubeUrl: string | null;
}

export interface CreateGameLogForm extends BaseGameLogForm {
  gameLogImage: FileList | null;
}

export interface UpdateGameLogForm extends BaseGameLogForm {
  gameLogImage: FileList | string | null;
}
