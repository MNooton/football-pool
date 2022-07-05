import { Component, OnInit  } from '@angular/core';
import { CognitoService } from './cognito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'football-pool';
    isAuthenticated: boolean;

    constructor(private router: Router, private cognitoService: CognitoService) {
      this.isAuthenticated = false;
    }

    public ngOnInit(): void {
      this.cognitoService.isAuthenticated()
      .then((success: boolean) => {
        this.isAuthenticated = success;
      });
    }

    public signOut(): void {
      this.cognitoService.signOut()
      .then(() => {
        this.router.navigate(['/signIn']);
      });
    }

  }
