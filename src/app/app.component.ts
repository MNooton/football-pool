import { Component, OnInit  } from '@angular/core';
import { CognitoService } from '../shared/services/cognito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'football-pool';
    isAuthenticated: boolean;
    username = null;

    constructor(private router: Router, private cognitoService: CognitoService) {
      this.isAuthenticated = false;
    }

    public ngOnInit(): void {
      this.cognitoService.authenticationSubject.subscribe(val => {
        if (val) {
          this.username = this.cognitoService.currentUser.name;
          this.isAuthenticated = val;
        } else {
          this.username = null;
          this.isAuthenticated = val;
        }
      });
    }

    public signOut(): void {
      this.cognitoService.signOut()
      .then(() => {
        this.router.navigate(['/signIn']);
        this.username = '';
      });
    }

    public getUsername(): string {
      return this.cognitoService.currentUser.name;
    }

  }
