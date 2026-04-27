export interface KboEventRow {
  idEvent: string;
  idHomeTeam: string;
  idAwayTeam: string;
  idLeague: string;
  idVenue: string;
  idAPIfootball: string;
  dateEvent: string;
  dateEventLocal: string;
  strTime: string;
  strTimeLocal: string;
  strTimestamp: string;
  strEvent: string;
  strEventAlternate: string;
  strFilename: string;
  strHomeTeam: string;
  strAwayTeam: string;
  strHomeTeamBadge: string;
  strAwayTeamBadge: string;
  strVenue: string | null;
  strCity: string;
  strCountry: string;
  strLeague: string;
  strLeagueBadge: string;
  strSport: string;
  strSeason: string;
  strStatus: string;
  strPostponed: string;
  strResult: string;
  strDescriptionEN: string;
  strThumb: string | null;
  strVideo: string | null;
  strBanner: string;
  strPoster: string;
  strSquare: string;
  strGroup: string;
  strTweet1: string;
  intHomeScore: string;
  intAwayScore: string;
  intRound: string;
  intScore: string | null;
  intScoreVotes: string | null;
  intSpectators: string | null;
  strFanart: string | null;
  strMap: string | null;
  strOfficial: string | null;
  strLocked: string;
}

export interface GetKboEventsByDayQueryModel {
  day: string;
}
