import { Component, OnInit } from '@angular/core';
import { Schedule } from 'src/shared/models/interface.schedule';
import { DateFunctionService } from 'src/shared/services/date.function.service';
import { RecordService } from 'src/shared/services/record.service';

@Component({
  selector: 'app-schedule-browser',
  templateUrl: './schedule-browser.component.html',
  styleUrls: ['./schedule-browser.component.css']
})
export class ScheduleBrowserComponent implements OnInit {
  // schedule: Schedule = null;
  maxWeek = 18;
  selectedWeekId = 1;
  selectedWeek;
  selectedWeekIndex(): number { return this.selectedWeekId - 1; }

  constructor(private dateFunctionService: DateFunctionService, private recordService: RecordService) {

  }

  ngOnInit(): void {
    this.setCurrentWeekId();
    this.selectedWeek = this.recordService.scheduleData.weeks[this.selectedWeekIndex()];
  }

  previousWeek(): void {
    if (this.selectedWeekId === 1){
      this.selectedWeekId = this.maxWeek;
    }
    else {
      this.selectedWeekId = this.selectedWeekId - 1;
    }
    this.selectedWeek = this.recordService.scheduleData.weeks[this.selectedWeekIndex()];
  }

  nextWeek(): void {
    if (this.selectedWeekId === this.maxWeek){
      this.selectedWeekId = 1;
    }
    else {
      this.selectedWeekId = this.selectedWeekId + 1;
    }
    this.selectedWeek = this.recordService.scheduleData.weeks[this.selectedWeekIndex()];
  }

  setCurrentWeekId(): void {
    const currentDate = this.dateFunctionService.getYYYYMMDDFromDate(new Date());
    this.recordService.scheduleData.weeks.forEach((week) => {
      // get Monday
      let mondayGame = week.games.filter((day) => day.dayId === 2)[0];

      if (!mondayGame){
        mondayGame = week.games.filter((day) => day.dayId === 1)[0];
      }
      // need to do something here for weeks that don't have a monday.. Maybe find sunday if not exists.

      if ((currentDate) >  (mondayGame.dateTimeUtc )){
        this.selectedWeekId = mondayGame.weekId + 1;
      }
    });
  }
}
