export interface Game {
  id: number;
  weekId: number;
  homeTeamId: number;
  awayTeamId: number;
  awayTeamSpread: string;
  dayId: number;
  dateTimeUtc: string;
  homePoints: number;
  awayPoints: number;
}
