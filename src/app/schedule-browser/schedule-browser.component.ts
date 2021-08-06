import { Component, OnInit } from '@angular/core';
import scheduleData from '../../shared/data/schedule_2021.json';

@Component({
  selector: 'app-schedule-browser',
  templateUrl: './schedule-browser.component.html',
  styleUrls: ['./schedule-browser.component.css']
})
export class ScheduleBrowserComponent implements OnInit {
  schedule = scheduleData;
  selectedWeek;
  constructor() { }

  ngOnInit(): void {
    console.log(this.schedule.weeks);
    this.selectedWeek = this.schedule.weeks[0];
  }

}

// Keep watching this: https://zoaibkhan.com/blog/create-a-responsive-card-grid-in-angular-using-flex-layout-part-1/
// https://blog.briebug.com/blog/5-ways-to-pass-data-into-child-components-in-angular
