import { Component, OnInit } from '@angular/core';
import { DateFunctionService } from 'src/shared/services/date.function.service';
import scheduleData from '../../shared/data/schedule_2021.json';

@Component({
  selector: 'app-schedule-browser',
  templateUrl: './schedule-browser.component.html',
  styleUrls: ['./schedule-browser.component.css']
})
export class ScheduleBrowserComponent implements OnInit {
  schedule = scheduleData;
  selectedWeekId = 0;
  selectedWeek;
  constructor(private dateFunctionService: DateFunctionService) { }

  ngOnInit(): void {
    console.log(this.schedule.weeks);
    this.setCurrentWeekId();
    console.log(this.selectedWeekId);
    this.selectedWeek = this.schedule.weeks[this.selectedWeekId];
  }

  previousWeek(): void {
    if (this.selectedWeekId === 0){
      this.selectedWeekId = 17;
    }
    else {
      this.selectedWeekId = this.selectedWeekId - 1;
    }
    this.selectedWeek = this.schedule.weeks[this.selectedWeekId];
  }

  nextWeek(): void {
    if (this.selectedWeekId === 17){
      this.selectedWeekId = 0;
    }
    else {
      this.selectedWeekId = this.selectedWeekId + 1;
    }
    this.selectedWeek = this.schedule.weeks[this.selectedWeekId];
  }

  setCurrentWeekId(): void {
    const currentDate = this.dateFunctionService.getYYYYMMDDFromDate(new Date());

    this.schedule.weeks.forEach((week) => {
      // get Monday
      const mondayGame = week.games.filter((day) => day.dayId === 2)[0];
      const mondayGameDate = mondayGame.dateTimeUtc;

      if (currentDate > mondayGameDate){
        console.log('current Date: ' + currentDate);
        console.log('mondayGameDate: ' + mondayGameDate);
        this.selectedWeekId = mondayGame.weekId + 1;
      }
      else {}
    });
  }
}

// Keep watching this: https://zoaibkhan.com/blog/create-a-responsive-card-grid-in-angular-using-flex-layout-part-1/
// https://blog.briebug.com/blog/5-ways-to-pass-data-into-child-components-in-angular
