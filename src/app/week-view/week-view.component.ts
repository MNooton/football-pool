import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Week } from 'src/shared/models/interface.week';
import { Pick } from 'src/shared/models/interface.pick';
import teamData from '../../shared/data/teams.json';
import dayData from '../../shared/data/days.json';
import { DateFunctionService } from 'src/shared/services/date.function.service';
import { DatePipe, getLocaleDateFormat } from '@angular/common';
import { RecordService } from 'src/shared/services/record.service';
import { AuthService } from 'src/shared/services/auth.service';
import {MatSnackBar, MatSnackBarRef, MatSnackBarModule} from '@angular/material/snack-bar';
// import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { FileService } from 'src/shared/services/file.service';
import { SaveSnackBarComponent } from '../save-snack-bar/save-snack-bar.component';
import { APP_CONSTANTS } from '../../shared/constants';

@Component({
    selector: 'app-week-view',
    templateUrl: './week-view.component.html',
    styleUrls: ['./week-view.component.css'],
    standalone: false
})
export class WeekViewComponent implements OnInit, OnChanges {
  teams = teamData;
  days = dayData;
  games = null;
  adjectives = ['brutal', 'embarrassing', 'good', 'weird', 'questionable', 'decent', 'smart', 'O.P.', 'stupid, motherfucking', 'whack', 'irrational', 'intelligent', 'flawed'];
  pickMade = false;
  newPicks: Pick[];
  myPicks: Pick[];
  currentWeekId: number;

  @Input() week: Week;

  constructor(private dateFunctionService: DateFunctionService,
              private datepipe: DatePipe,
              public recordService: RecordService,
              public authService: AuthService,
              public fileService: FileService,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.myPicks = this.recordService.pickData.filter(x => x.personId === this.authService.currentUser.email);
    this.currentWeekId = this.week.id; // The schedule browser will automatically set us to the current week.
    this.setWeek();
  }

  // tslint:disable-next-line:typedef
  ngOnChanges(changes: SimpleChanges) {
    // console.log(this.recordService.pickData);
    this.setWeek();
  }

  setWeek(): void {
    this.games = this.week.games.map( game => {
      //  Set winningTeam to none/0 if the game hasn't bee played yet.
      // tslint:disable-next-line:max-line-length
      const winningTeamId = (this.dateFunctionService.dateWithoutTime(new Date()) > this.dateFunctionService.getDateFromYYYYMMDD(game.dateTimeUtc)) ? this.recordService.getWinner(game) : 0;
      return {
      id: game.id,
      // tslint:disable-next-line:object-literal-shorthand
      winningTeamId: winningTeamId,
      myPick: this.recordService.pickData.filter(pick => pick.gameId === game.id)
        .filter(myPick => myPick.personId === this.authService.currentUser.email)[0]?.winningTeamId,
      weekId: game.weekId,
      date: this.datepipe.transform(this.dateFunctionService.getDateFromYYYYMMDD(game.dateTimeUtc), 'mediumDate'),
      dateTimeUtc: game.dateTimeUtc,
      dayName: this.days.filter( day => day.id === game.dayId)[0].name,
      awayTeam: this.teams.filter(team => team.id === game.awayTeamId).map( awayTeam => ({
        city: awayTeam.city,
        name: awayTeam.name,
        imageUrl: awayTeam.imageUrl,
        id: awayTeam.id,
        points: game.awayPoints,
        // tslint:disable-next-line:max-line-length
        spread: (Number(game.awayTeamSpread)) ? ((Number(game.awayTeamSpread) < 0) ? '' + game.awayTeamSpread : '+' + game.awayTeamSpread ) : '+/-'
      }))[0],

      homeTeam: this.teams.filter(team => team.id === game.homeTeamId).map( homeTeam => ({
        city: homeTeam.city,
        name: homeTeam.name,
        imageUrl: homeTeam.imageUrl,
        points: game.homePoints,
        id: homeTeam.id
      }))[0],
      picks: this.recordService.pickData.filter(pick => pick.gameId === game.id).map( filteredPick => ({
        isPlayed: this.dateFunctionService.dateWithoutTime(new Date()) > this.dateFunctionService.getDateFromYYYYMMDD(game.dateTimeUtc),
        name: this.recordService.personData.filter(person => person.id === filteredPick.personId)[0]?.name,
        imageUrl: this.teams.filter(team => team.id === filteredPick.winningTeamId)[0].imageUrl,
        status: filteredPick.winningTeamId === winningTeamId ? 'W' : (winningTeamId === 0) ? 'T' : 'L'
      }))
    };

  });
  
  }

  randomIntFromInterval(min: number, max: number): number { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Should insert into person's list of picks
  // Should highlight the pick
  pick(gameId: number, teamId: number): void {
  // show the save button
  if (!this.pickMade) {
    this.pickMade = true;
    const rndInt = this.randomIntFromInterval(0, this.adjectives.length - 1);

    this.snackBar.openFromComponent(SaveSnackBarComponent, {
      data: {
        message: `You have made some ${this.adjectives[rndInt]} picks`,
        actionName: 'Save',
        preClose: () => {
          this.snackBar.dismiss();
          this.pickMade = false;
        },
        action: () => {
          this.savePicks();
          this.pickMade = false;
        }
      },
    });
  }

  const gameIndex = this.games.findIndex(item => item.id === gameId);
  if (gameIndex === -1) return;

  const game = this.games[gameIndex];
  const uiPickIndex = game.picks.findIndex(pick => pick.name === this.authService.currentUser.name);

  const uiPick = {
    isPlayed: false,
    gameId,
    name: this.authService.currentUser.name,
    imageUrl: this.teams.find(team => team.id === teamId)?.imageUrl || '',
    winningTeamId: teamId,
    status: ''
  };

  const recordPick = {
    name: uiPick.name,
    gameId,
    winningTeamId: uiPick.winningTeamId
  };

  // 🔥 create an updated copy of the game object
  const updatedGame = {
    ...game,
    myPick: teamId,
    picks: uiPickIndex === -1
      ? [...game.picks, uiPick]
      : game.picks.map((p, idx) => idx === uiPickIndex ? uiPick : p)
  };

  // 🔥 replace the game in the array with a new object
  this.games = this.games.map((g, idx) =>
    idx === gameIndex ? updatedGame : g
  );

  // update myPicks immutably too
  const recordPickIndex = this.myPicks.findIndex(pick => pick.gameId === gameId);
  this.myPicks =
    recordPickIndex === -1
      ? [...this.myPicks, recordPick]
      : this.myPicks.map((p, idx) => idx === recordPickIndex ? recordPick : p);
}


  // persist myPicks to storage
  async savePicks(): Promise<void> {
    const cacheBuster = Date.now();
    const content = this.recordService.createPickContent(this.myPicks, this.authService.currentUser.email
    , this.authService.currentUser.gender
    , this.authService.currentUser.name);

    const filenamePrefix = 'public/picks/picks_' + APP_CONSTANTS.YEAR + '_' + this.authService.currentUser.email;

    const filename = filenamePrefix + '_' + cacheBuster + '.json';

    this.fileService.writeFile(filename, JSON.stringify(content)).then(response => {
      if (response) {
        this.pickMade = false;
        this.snackBar.open('Your picks have been saved!', '', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['blue-snackbar'],
          duration: 2000
        });

        this.fileService.cleanupOldFiles(filenamePrefix, filename);

      } else {// error
        console.log('error!');

      }
    });
  }

  disablePickButton(game: any): boolean {
    // if (this.currentWeekId !== game.weekId) {
    //   return true;
    // }

    // if (new Date() > this.dateFunctionService.getDateFromYYYYMMDD(game.dateTimeUtc)) {
    //   return true;
    // }
    return false;
  }

}
