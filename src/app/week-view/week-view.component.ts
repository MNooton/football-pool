import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Week } from 'src/shared/models/interface.week';
import teamData from '../../shared/data/teams.json';
import dayData from '../../shared/data/days.json';
import { DateFunctionService } from 'src/shared/services/date.function.service';
import { DatePipe } from '@angular/common';
import { RecordService } from 'src/shared/services/record.service';

@Component({
  selector: 'app-week-view',
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.css']
})
export class WeekViewComponent implements OnInit, OnChanges {
  teams = teamData;
  days = dayData;
  games = null;

  @Input() week: Week;

  constructor(private dateFunctionService: DateFunctionService,
              private datepipe: DatePipe,
              public recordService: RecordService) { }

  ngOnInit(): void {
    console.log(this.week);
    this.setWeek();
    console.log(this.games);
  }

  // tslint:disable-next-line:typedef
  ngOnChanges(changes: SimpleChanges) {
   // console.log(changes);
    this.setWeek();
  }

  setWeek(): void {
    this.games = this.week.games.map( game => {
      const winningTeamId = this.recordService.getWinner(game);
      return {
      id: game.id,
      // tslint:disable-next-line:object-literal-shorthand
      winningTeamId: winningTeamId,
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
        name: this.recordService.personData.filter(person => person.id === filteredPick.personId)[0].name,
        imageUrl: this.teams.filter(team => team.id === filteredPick.winningTeamId)[0].imageUrl,
        status: filteredPick.winningTeamId === winningTeamId ? 'W' : (winningTeamId === 0) ? 'T' : 'L'
      }))
  }; });
  }
}
