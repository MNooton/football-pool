import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import * as Hammer from 'hammerjs';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScheduleBrowserComponent } from './schedule-browser/schedule-browser.component';
import { HomeComponent } from './home/home.component';
import { StandingsComponent } from './standings/standings.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WeekViewComponent } from './week-view/week-view.component';
import { GameCardComponent } from './game-card/game-card.component';
import { DateFunctionService } from 'src/shared/services/date.function.service';
import { DatePipe } from '@angular/common';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RecordService } from 'src/shared/services/record.service';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    swipe: { direction: Hammer.DIRECTION_HORIZONTAL },
    pinch: { enable: false },
    rotate: { enable: false }
  } as any;
}


const routes: Routes = [
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'schedule', component: ScheduleBrowserComponent
  },
  {
    path: 'standings', component: StandingsComponent
  },
  {
    path: '', redirectTo: '/schedule', pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ScheduleBrowserComponent,
    HomeComponent,
    StandingsComponent,
    WeekViewComponent,
    GameCardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { useHash: true}),
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    FlexLayoutModule,
    MatTableModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatBadgeModule,
    HammerModule
  ],
  providers: [DateFunctionService, RecordService, DatePipe, {provide: LocationStrategy, useClass: HashLocationStrategy}
    , { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig }],
  bootstrap: [AppComponent]
})
export class AppModule { }
