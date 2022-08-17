import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Week } from 'src/shared/models/interface.week';
import { Pick } from 'src/shared/models/interface.pick';
import teamData from '../../shared/data/teams.json';
import dayData from '../../shared/data/days.json';
import { DateFunctionService } from 'src/shared/services/date.function.service';
import { DatePipe } from '@angular/common';
import { RecordService } from 'src/shared/services/record.service';
import { CognitoService } from 'src/shared/services/cognito.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileService } from 'src/shared/services/file.service';
import { SaveSnackBarComponent } from '../save-snack-bar/save-snack-bar.component';

@Component({
  selector: 'app-week-view',
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.css']
})
export class WeekViewComponent implements OnInit, OnChanges {
  teams = teamData;
  days = dayData;
  games = null;
  adjectives = ['brutal', 'embarrassing', 'shitty', 'good', 'weird', 'questionable', 'retarded', 'decent', 'smart', 'bitch-ass', 'bad', 'horny', 'dumb', 'stupid, motherfucking', 'whack', 'irrational', 'intelligent', 'gay'];
  pickMade = false;
  newPicks: Pick[];
  myPicks: Pick[];
  currentWeekId: number;

  @Input() week: Week;

  constructor(private dateFunctionService: DateFunctionService,
              private datepipe: DatePipe,
              public recordService: RecordService,
              public cognitoService: CognitoService,
              public fileService: FileService,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.myPicks = this.recordService.pickData.filter(x => x.personId === this.cognitoService.currentUser.email);
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
        .filter(myPick => myPick.personId === this.cognitoService.currentUser.email)[0]?.winningTeamId,
      weekId: game.weekId,
      date: this.datepipe.transform(this.dateFunctionService.getDateFromYYYYMMDD(game.dateTimeUtc), 'mediumDate'),
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
  pick(gameId, teamId): void {
    // show the save button
    console.log({ pickmade: this.pickMade});
    if (!this.pickMade) {
        this.pickMade = true;
        const rndInt = this.randomIntFromInterval(0, this.adjectives.length - 1);
       // const saveButtonSnackBar = this.snackBar.open(`You have made some ${ this.adjectives[rndInt] } picks`, 'Save');
        const saveButtonSnackBar = this.snackBar.openFromComponent(SaveSnackBarComponent, {
          data: {
            message: `You have made some ${ this.adjectives[rndInt] } picks`,
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
      //   saveButtonSnackBar.onAction().subscribe(() => {
      //   this.savePicks();
      // });
    }

    const gameIndex = this.games.findIndex(item => item.id === gameId);
    const game = this.games[gameIndex];
    const uiPickIndex = game.picks.findIndex(pick => pick.name === this.cognitoService.currentUser.name);

    const uiPick = {
      isPlayed: false,
      gameId,
      name: this.cognitoService.currentUser.name,
      imageUrl: this.teams.filter(team => team.id === teamId)[0].imageUrl,
      winningTeamId: teamId,
      status: ''
    };
    const recordPick = {
      name: uiPick.name,
      gameId,
      winningTeamId: uiPick.winningTeamId
    };

    game.myPick = uiPick.winningTeamId;

    if (uiPickIndex === -1) {
      game.picks.push(uiPick);
    } else {
      game.picks[uiPickIndex] = uiPick;
    }

    const recordPickIndex = this.myPicks.findIndex(pick => pick.gameId === gameId);

    if (recordPickIndex === -1) {
      this.myPicks.push(recordPick);
    } else {
      this.myPicks[recordPickIndex] = recordPick;
    }
  }

  // persist myPicks to storage
  savePicks(): void {
    const content = this.recordService.createPickContent(this.myPicks, this.cognitoService.currentUser.email
    , this.cognitoService.currentUser.gender
    , this.cognitoService.currentUser.name);

    const filename = 'picks_2022_' + this.cognitoService.currentUser.email + '.json';
    this.fileService.writeFile(filename, JSON.stringify(content)).then(response => {
      if (response) {
        this.pickMade = false;
        this.snackBar.open('Your picks have been saved!', '', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['blue-snackbar'],
          duration: 2000
        });
      } else {// error
        console.log('error!');

      }
    });
  }

}
