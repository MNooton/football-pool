import { Component, Input, OnInit } from '@angular/core';
import { Game } from 'src/shared/models/interface.game';
import { Team } from 'src/shared/models/interface.team';
import { Week } from 'src/shared/models/interface.week';
import teamData from '../../shared/data/teams.json';

@Component({
  selector: 'app-week-view',
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.css']
})
export class WeekViewComponent implements OnInit {
  teams = teamData;
  games = null;

  @Input() week: Week;
  constructor() { }

  ngOnInit(): void {
    console.log(this.week);
    this.games = this.week.games.map( game => ({
      id: game.id,
      weekId: game.weekId,
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
    console.log(this.games);
  }

}
