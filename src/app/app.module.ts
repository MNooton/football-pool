import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatMenu, MatMenuModule } from '@angular/material/menu';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScheduleBrowserComponent } from './schedule-browser/schedule-browser.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { HomeComponent } from './home/home.component';
import { StandingsComponent } from './standings/standings.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WeekViewComponent } from './week-view/week-view.component';
import { GameCardComponent } from './game-card/game-card.component';
import { DateFunctionService } from 'src/shared/services/date.function.service';
import { DatePipe } from '@angular/common';

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
    path: '', redirectTo: '/home', pathMatch: 'full'
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
    RouterModule.forRoot(routes),
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    FlexLayoutModule
  ],
  providers: [DateFunctionService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
