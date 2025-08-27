import { Component, OnInit  } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { APP_CONSTANTS } from '../shared/constants';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit {
    title = 'football-pool';
    isAuthenticated: boolean;
    username = null;
    year = APP_CONSTANTS.YEAR

    constructor(private router: Router, private authService: AuthService) {
      this.isAuthenticated = false;
    }

    public ngOnInit(): void {
      this.authService.authenticationSubject.subscribe(val => {
        if (val) {
          this.username = this.authService.currentUser.name;
          this.isAuthenticated = val;
        } else {
          this.username = null;
          this.isAuthenticated = val;
        }
      });
    }

    public signOut(): void {
      this.authService.signOut()
      .then(() => {
        this.router.navigate(['/signIn']);
        this.username = '';
      });
    }

    public getUsername(): string {
      return this.authService.currentUser.name;
    }

  }
