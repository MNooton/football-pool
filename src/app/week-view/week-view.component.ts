import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Game } from 'src/shared/models/interface.game';
import { Team } from 'src/shared/models/interface.team';
import { Week } from 'src/shared/models/interface.week';
import teamData from '../../shared/data/teams.json';
import dayData from '../../shared/data/days.json';
import { DateFunctionService } from 'src/shared/services/date.function.service';
import { DatePipe } from '@angular/common';

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
              private datepipe: DatePipe) { }

  ngOnInit(): void {
    console.log(this.week);
    this.setWeek();
    console.log(this.games);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    this.setWeek();
  }

  setWeek(): void {
    this.games = this.week.games.map( game => ({
      id: game.id,
      weekId: game.weekId,
      date: this.datepipe.transform(this.dateFunctionService.getDateFromYYYYMMDD(game.dateTimeUtc), 'mediumDate'),
      dayName: this.days.filter( day => day.id === game.dayId)[0].name,
      awayTeam: this.teams.filter(team => team.id === game.awayTeamId).map( awayTeam => ({
        city: awayTeam.city,
        name: awayTeam.name,
        imageUrl: awayTeam.imageUrl,
        id: awayTeam.id
      }))[0],

      homeTeam: this.teams.filter(team => team.id === game.homeTeamId).map( homeTeam => ({
        city: homeTeam.city,
        name: homeTeam.name,
        imageUrl: homeTeam.imageUrl,
        id: homeTeam.id
      }))[0]
    }));
  }
}
