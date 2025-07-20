import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { IUser, CognitoService } from '../../shared/services/cognito.service';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css'],
    standalone: false
})
export class SignInComponent {

  loading: boolean;
  user: IUser;

  constructor(private router: Router,
              private cognitoService: CognitoService,
              private snackBar: MatSnackBar) {
    this.loading = false;
    this.user = {
      name: '',
      email: '',
      password: ''
    } as IUser;
  }

  public signIn(): void {
    this.loading = true;
    this.cognitoService.signIn(this.user)
    .then(() => {
      this.router.navigate(['/schedule']);
    }).catch((err) => {
      this.snackBar.open('ERROR: ' + err.message, 'Ok', {
        duration: 5000
      } );
      this.loading = false;
    });
  }

  public setPassword(password): void {
    this.user.password = password;
  }

  public setEmail(email): void {
    this.user.email = email;
  }

  public setUsername(username): void {
    this.user.name = username;
  }
}
