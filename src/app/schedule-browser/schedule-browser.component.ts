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
  selectedWeekId = 1;
  selectedWeek;
  selectedWeekIndex(): number { return this.selectedWeekId - 1; }

  constructor(private dateFunctionService: DateFunctionService) { }

  ngOnInit(): void {
    console.log(`Selected Week ${ this.selectedWeekId }`);
    console.log(this.schedule.weeks);
    this.setCurrentWeekId();
    console.log(`Selected Week ${ this.selectedWeekId }`);
    this.selectedWeek = this.schedule.weeks[this.selectedWeekIndex()];
  }

  previousWeek(): void {
    console.log(`Selected Week ${ this.selectedWeekId }`);
    if (this.selectedWeekId === 1){
      this.selectedWeekId = 17;
    }
    else {
      this.selectedWeekId = this.selectedWeekId - 1;
    }
    this.selectedWeek = this.schedule.weeks[this.selectedWeekIndex()];
    console.log(`New Selected Week ${ this.selectedWeekId }`);
  }

  nextWeek(): void {
    console.log(`Selected Week ${ this.selectedWeekId }`);
    if (this.selectedWeekId === 17){
      this.selectedWeekId = 1;
    }
    else {
      this.selectedWeekId = this.selectedWeekId + 1;
    }
    this.selectedWeek = this.schedule.weeks[this.selectedWeekIndex()];
    console.log(`New Selected Week ${ this.selectedWeekId }`);
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
