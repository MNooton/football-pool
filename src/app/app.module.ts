import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';
import { Injectable, NgModule, APP_INITIALIZER  } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
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
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ProfileComponent } from './profile/profile.component';
import { OnlyLoggedInUsersGuard } from 'src/shared/services/onlyLoggedInUsers.guard';
import { CognitoService } from 'src/shared/services/cognito.service';
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
    path: 'home', component: HomeComponent, canActivate: [OnlyLoggedInUsersGuard]
  },
  {
    path: 'schedule', component: ScheduleBrowserComponent, canActivate: [OnlyLoggedInUsersGuard]
  },
  {
    path: 'standings', component: StandingsComponent, canActivate: [OnlyLoggedInUsersGuard]
  },
  {
    path: 'signUp', component: SignUpComponent
  },
  {
    path: 'signIn', component: SignInComponent
  },
  {
    path: 'profile', component: ProfileComponent, canActivate: [OnlyLoggedInUsersGuard]
  },
  {
    path: '', redirectTo: '/schedule', pathMatch: 'full', canActivate: [OnlyLoggedInUsersGuard]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ScheduleBrowserComponent,
    HomeComponent,
    StandingsComponent,
    WeekViewComponent,
    GameCardComponent,
    SignUpComponent,
    SignInComponent,
    ProfileComponent
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
    HammerModule,
    MatSnackBarModule,
    MatSelectModule
  ],
  providers: [DateFunctionService, RecordService, DatePipe
    , OnlyLoggedInUsersGuard, {provide: LocationStrategy, useClass: HashLocationStrategy}, CognitoService
    , { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
    {
      provide: APP_INITIALIZER,
      useFactory: (cs: CognitoService) => () => cs.isAuthenticated(),
      deps: [CognitoService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (rs: RecordService) => () => rs.loadRecords(),
      deps: [RecordService],
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
