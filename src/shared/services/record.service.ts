import { Injectable } from '@angular/core';
import { Schedule } from '../models/interface.schedule';
import { Pick } from '../models/interface.pick';
import { Game } from '../models/interface.game';
import { WeekViewComponent } from 'src/app/week-view/week-view.component';
import { HeaderRowOutlet } from '@angular/cdk/table';
import { DateFunctionService } from './date.function.service';
import importedScheduleData from '../../shared/data/schedule_2021.json';
import importedPickData from '../../shared/data/picks_2021.json';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  playedGames: Game[];
  currentDate: Date;
  scheduleData: Schedule;
  pickData: Pick[];

  constructor(public dateFunctionService: DateFunctionService) {
    this.currentDate = this.dateFunctionService.getDateFromYYYYMMDD('20211013');
    this.scheduleData = importedScheduleData;
    this.pickData = importedPickData;
    this.playedGames = this.scheduleData.weeks.flatMap(week =>
      week.games.filter(game => {
        return this.dateFunctionService.getDateFromYYYYMMDD(game.dateTimeUtc) < this.currentDate;
      }));
      // Looks like I'm calculating the played games ok. Now I need to load the picks and calculate some records!
    console.log( { schedule: this.scheduleData, games: this.playedGames});
  }

  // getRecord(personId: number, games: string {
  //   let wins = '';
  //   let ties = '';
  //   let losses = '';

  //   // get the current date
  //   const today = new Date();
  //   // get all the person's picks
  //   const picks = this.pickData.filter(x => x.personId === personId);
  //   // get all the games from the schedule that are < current date



  // }

  // return the winning team Id. In case of tie, return 0
  // getWinner(game: Game): number {
  //   let result = 0;
  //   const awayWin = (game.awayTeamSpread + game.awayPoints) > game.homePoints;
  //   const homeWin = (game.awayTeamSpread + game.awayPoints) < game.homePoints;

  //   if (awayWin) {
  //     result = game.awayTeamId;
  //   } else if (homeWin) {
  //     result = game.homeTeamId;
  //   }
  //   return result;
  // }


}
