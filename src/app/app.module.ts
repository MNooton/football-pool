import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';
import { Injectable, NgModule, APP_INITIALIZER, inject  } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import {MatSnackBar, MatSnackBarRef, MatSnackBarModule} from '@angular/material/snack-bar';
// import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import * as Hammer from 'hammerjs';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScheduleBrowserComponent } from './schedule-browser/schedule-browser.component';
import { HomeComponent } from './home/home.component';
import { StandingsComponent } from './standings/standings.component';
import { WeekViewComponent } from './week-view/week-view.component';
import { GameCardComponent } from './game-card/game-card.component';
import { DateFunctionService } from 'src/shared/services/date.function.service';
import { DatePipe } from '@angular/common';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
// import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatButtonModule as MatButtonModule } from '@angular/material/button';
import { RecordService } from 'src/shared/services/record.service';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ProfileComponent } from './profile/profile.component';
import { OnlyLoggedInUsersGuard } from 'src/shared/services/onlyLoggedInUsers.guard';
import { CognitoService } from 'src/shared/services/cognito.service';
import { SaveSnackBarComponent } from './save-snack-bar/save-snack-bar.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
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
    path: 'home', component: HomeComponent, canActivate: [() => inject(OnlyLoggedInUsersGuard).canActivate()]
  },
  {
    path: 'schedule', component: ScheduleBrowserComponent, canActivate: [() => inject(OnlyLoggedInUsersGuard).canActivate()]
  },
  {
    path: 'standings', component: StandingsComponent, canActivate: [() => inject(OnlyLoggedInUsersGuard).canActivate()]
  },
  {
    path: 'signUp', component: SignUpComponent
  },
  {
    path: 'signIn', component: SignInComponent
  },
  {
    path: 'profile', component: ProfileComponent, canActivate: [() => inject(OnlyLoggedInUsersGuard).canActivate()]
  },
  {
    path: 'forgotPassword', component: ForgotPasswordComponent
  },
  { path: '', redirectTo: '/schedule', pathMatch: 'full' }
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
    ProfileComponent,
    SaveSnackBarComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { useHash: true }),
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
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
