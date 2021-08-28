import { Injectable } from '@angular/core';
import { Schedule } from '../models/interface.schedule';
import { Pick } from '../models/interface.pick';
import { Game } from '../models/interface.game';
import { Record } from '../models/interface.record';
import { DateFunctionService } from './date.function.service';
import importedScheduleData from '../../shared/data/schedule_2021.json';
import importedPickData from '../../shared/data/picks_2021.json';
import importedPersonData from '../../shared/data/persons.json';
import { GameResult } from '../models/interface.gameResult';
import { NodeWithI18n } from '@angular/compiler';
import { Standing } from '../models/interface.standing';
import { Person } from '../models/interface.person';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  playedGames: GameResult[];
  currentDate: Date;
  scheduleData: Schedule;
  pickData: Pick[];
  personData: Person[];

  constructor(public dateFunctionService: DateFunctionService) {
    console.log('INSTANTIATED THE RECORD SERVICE');
    this.currentDate = this.dateFunctionService.getDateFromYYYYMMDD('20211013');
    this.scheduleData = importedScheduleData;
    this.personData = importedPersonData;
    this.pickData = importedPickData;
    this.playedGames = this.scheduleData.weeks.flatMap(week =>
      week.games.filter(game => {
        return this.dateFunctionService.getDateFromYYYYMMDD(game.dateTimeUtc) < this.currentDate;
      })).map(playedGame => (
        {
          gameId: playedGame.id,
          winningTeamId: this.getWinner(playedGame)
        }
      ));
      // Looks like I'm calculating the played games ok. Now I need to load the picks and calculate some records!
    console.log( { schedule: this.scheduleData, games: this.playedGames, picks: this.pickData});
  }

  getRecord(personId: number): Record {
    const picks = this.pickData.filter(pick => pick.personId === personId);
    let wins = 0;
    let ties = 0;
    let losses = 0;

    this.playedGames.forEach(game => {
      const pick = picks.filter(p => p.gameId === game.gameId)[0];
      if (pick) {
        if (pick.winningTeamId === game.winningTeamId) { wins = wins + 1; }
        else if (game.winningTeamId === 0) {ties = ties + 1; }
        else { losses = losses + 1; }
      }
    });

    const record: Record = {
      record: `${wins}-${losses}-${ties}`,
      points: (wins * 2) + ties
    };

    return record; // W-L-T

  }

  // return the winning team Id. In case of tie, return 0
  getWinner(game: Game): number {
    let result = 0;
    const awayTeamSpread = Number(game.awayTeamSpread);
    if ( awayTeamSpread ) {
      const awayWin = (awayTeamSpread + game.awayPoints) > game.homePoints;
      const homeWin = (awayTeamSpread + game.awayPoints) < game.homePoints;

      if (awayWin) {
        result = game.awayTeamId;
      } else if (homeWin) {
        result = game.homeTeamId;
      }
    }
    return result;
  }

  // tslint:disable-next-line:typedef
  rankStandings(oldStandings: Standing[]){
    let newStandings: Standing[] = [];
    let currentRank = 1;
    while ( oldStandings.length > 0) {
      // get the highest score. Assign all with that score rank 1.
      const maxPoints = Math.max.apply(Math, oldStandings.map(standing => standing.points));

      //
      newStandings = newStandings.concat(oldStandings.filter(s => s.points === maxPoints).map(filteredItem => {
        return {
          personId: filteredItem.personId,
          rank: currentRank,
          imageUrl: filteredItem.imageUrl,
          name: filteredItem.name,
          record: filteredItem.record,
          points: filteredItem.points
        };
      }));

      currentRank += 1;
      oldStandings = oldStandings.filter(s => s.points !== maxPoints);
    }
    // console.log({ updatedStandings: newStandings});

    return newStandings;
  }

}
