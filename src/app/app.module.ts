import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScheduleBrowserComponent } from './schedule-browser/schedule-browser.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { HomeComponent } from './home/home.component';
import { StandingsComponent } from './standings/standings.component';

const routes: Routes = [
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'schedule', component: ScheduleBrowserComponent
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
    StandingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
