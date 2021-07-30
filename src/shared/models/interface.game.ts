export interface Game {
  id: number;
  weekId: number;
  homeTeamId: number;
  awayTeamId: number;
  homeTeamSpread: string;
  dayId: number;
  dateTimeUtc: string;
  homePoints: number;
  awayPoints: number;
}
