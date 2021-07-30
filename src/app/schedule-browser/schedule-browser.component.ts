import { Component, OnInit } from '@angular/core';
import * as scheduleData from '../../shared/data/schedule_2021.json';

@Component({
  selector: 'app-schedule-browser',
  templateUrl: './schedule-browser.component.html',
  styleUrls: ['./schedule-browser.component.css']
})
export class ScheduleBrowserComponent implements OnInit {
  schedule = scheduleData;
  constructor() { }

  ngOnInit(): void {
  }

}

// just installed ng carousel for this
// https://www.npmjs.com/package/@ngmodule/material-carousel
// https://www.techiediaries.com/angular-10-material-carousel-slider-images/
