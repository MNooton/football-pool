import { Injectable } from '@angular/core';
import { Schedule } from '../models/interface.schedule';
import { Pick } from '../models/interface.pick';
import { Game } from '../models/interface.game';
import { Record } from '../models/interface.record';
import { DateFunctionService } from './date.function.service';
import importedScheduleData from '../../shared/data/schedule_playoff_2026.json';
import importedPersonData from '../../shared/data/persons.json';
import { GameResult } from '../models/interface.gameResult';
import { ConstantPool, NodeWithI18n } from '@angular/compiler';
import { Standing } from '../models/interface.standing';
import { Person } from '../models/interface.person';
import { FileService } from './file.service';
import { PinpointSMSVoice } from 'aws-sdk';
import { APP_CONSTANTS } from '../../shared/constants';


@Injectable({
  providedIn: 'root'
})
export class RecordService {
  playedGames: GameResult[];
  currentDate: Date;
  scheduleData: Schedule;
  pickData: Pick[];
  personDataImport: Person[];
  personData: Person[];
  fileService: FileService;

  constructor(public dateFunctionService: DateFunctionService, fileService: FileService) {
    this.currentDate =  this.dateFunctionService.dateWithoutTime(new Date()); // this.dateFunctionService.getDateFromYYYYMMDD('20211013');
    this.scheduleData = importedScheduleData;
    this.personDataImport = importedPersonData;
    this.fileService = fileService;
  }

  loadRecords(): Promise<any> {
    console.log("load_records")
    return new Promise<void>((resolve, reject) => {
      this.pickData =  [];
      this.personData = [];
      this.getAllPicks().then(() => {
      this.playedGames = this.scheduleData.weeks.flatMap(week =>
          week.games.filter(game => {
            // console.log({ "date": this.currentDate });
            return this.dateFunctionService.getDateFromYYYYMMDD(game.dateTimeUtc) < this.currentDate;
          })).map(playedGame => (
            {
              gameId: playedGame.id,
              winningTeamId: this.getWinner(playedGame)
            }
          ));
          // Looks like I'm calculating the played games ok. Now I need to load the picks and calculate some records!
      resolve();
          }); });
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
   // if ( awayTeamSpread ) {
    const awayWin = (awayTeamSpread + game.awayPoints) > game.homePoints;
    const homeWin = (awayTeamSpread + game.awayPoints) < game.homePoints;

    if (awayWin) {
        result = game.awayTeamId;
      } else if (homeWin) {
        result = game.homeTeamId;
      }
    // }
    return result;
  }

  // tslint:disable-next-line:typedef
  rankStandings(oldStandings: Standing[]){
    let newStandings: Standing[] = [];
    let currentRankNumber = 1;
    while ( oldStandings.length > 0) {
      // get the highest score. Assign all with that score rank 1.
      const maxPoints = Math.max.apply(Math, oldStandings.map(standing => standing.points));

      const currentRank = oldStandings.filter(s => s.points === maxPoints).map(filteredItem => {
        return {
          personId: filteredItem.personId,
          rank: currentRankNumber,
          imageUrl: filteredItem.imageUrl,
          name: filteredItem.name,
          record: filteredItem.record,
          points: filteredItem.points
        };
      });
      //
      newStandings = newStandings.concat(currentRank);

      currentRankNumber += currentRank.length;
      oldStandings = oldStandings.filter(s => s.points !== maxPoints);
    }

    return newStandings;
  }

  createPickContent(picks: Pick[], personId: any, gender: any, userName: any): any {
    // tslint:disable-next-line:one-variable-per-declaration

    return  {
      personId,
      name: userName,
      gender,
      picks: picks.map(pick => ({
        gameId: pick.gameId,
        winningTeamId: pick.winningTeamId
      }))
    };
  }

  getAllPicks(): Promise<void> {
    return new Promise<void>((resolve, reject) => { this.fileService.listFiles().then(data => {
        const pickFileList = data.filter(file => file.path.startsWith(APP_CONSTANTS.PICK_FOLDER));
        let filesProcessed = 0;
        
        if (pickFileList.length === 0) {
          resolve();
        }

        pickFileList.forEach(x =>  {
          this.fileService.getFileText(x.path).then(pickFile => {
            // apparently I don't need this next line
            //const pickFileText = this.fileService.convertFileToString(pickFile);
            const fileContent = JSON.parse(pickFile);
            var personPic = this.personDataImport.find(x => x.email == fileContent.personId).imageUrl;

            if (!personPic){
              personPic = fileContent.gender === 'male' ? 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Person_Outline_2.svg' : 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Woman_Silhouette.svg'
            }

            const person = {
              id: fileContent.personId,
              name: fileContent.name,
              imageUrl: personPic 
            };
            this.personData.push(person);
            const picks = fileContent.picks.map(pick => ({
              personId: fileContent.personId,
              gameId: pick.gameId,
              winningTeamId: pick.winningTeamId
            }));

            this.pickData = this.pickData.concat(picks);
            filesProcessed += 1;
            if (filesProcessed === pickFileList.length) {
              resolve();
            }
          });
        });
      });
    });
  }

  getStandingsAtStartOfWeek(weekNumber: number): Standing[] {
    // Defensive: ensure picks & persons are loaded
    if (!this.pickData || !this.personData) {
      return [];
    }

    // WEEK 1: everyone starts 0-0-0
    if (weekNumber === 1) {
      const zeroStandings: Standing[] = this.personData.map(person => ({
        personId: person.id,
        name: person.name,
        imageUrl: person.imageUrl,
        record: '0-0-0',
        points: 0,
        rank: 1
      }));

      return (zeroStandings);
    }

    // 1️⃣ Get all games from weeks BEFORE the given week
    const gamesBeforeWeek = this.scheduleData.weeks
      .filter(w => w.id < weekNumber)   // or w.weekNumber depending on your model
      .flatMap(w => w.games);

  // 2️⃣ Determine which of those games have been played
  const playedGamesBeforeWeek: GameResult[] = gamesBeforeWeek
    .filter(game =>
      this.dateFunctionService.getDateFromYYYYMMDD(game.dateTimeUtc) < this.currentDate
    )
    .map(game => ({
      gameId: game.id,
      winningTeamId: this.getWinner(game)
    }));

  // 3️⃣ Calculate standings per person
  const standings: Standing[] = this.personData.map(person => {
    const picks = this.pickData.filter(p => p.personId === person.id);

    let wins = 0;
    let losses = 0;
    let ties = 0;

    playedGamesBeforeWeek.forEach(game => {
      const pick = picks.find(p => p.gameId === game.gameId);
      if (!pick) {
        return;
      }

      if (pick.winningTeamId === game.winningTeamId) {
        wins++;
      } else if (game.winningTeamId === 0) {
        ties++;
      } else {
        losses++;
      }
    });

    return {
      personId: person.id,
      name: person.name,
      imageUrl: person.imageUrl,
      record: `${wins}-${losses}-${ties}`,
      points: (wins * 2) + ties,
      rank: 1
    };
  });

  // 4️⃣ Rank standings
  return this.rankStandings(standings);
}

}
