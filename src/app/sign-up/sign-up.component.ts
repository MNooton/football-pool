import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { IUser, CognitoService } from '../../shared/services/cognito.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {

  loading: boolean;
  isConfirm: boolean;
  user: IUser;
  gender = '';

  constructor(private router: Router,
              private cognitoService: CognitoService,
              private snackBar: MatSnackBar) {
    this.loading = false;
    this.isConfirm = false;
    this.user = {
      name: '',
      email: 'test@test.com',
      password: 'passwordOne2!',
      code: '',
      gender: ''
    } as IUser;
  }

  public signUp(): void {
    if (this.gender !== 'female' && this.gender !== 'male'){
      this.snackBar.open('Please select your gender', 'Ok');
    }
    else {
      this.user.gender = this.gender;
      this.loading = true;
      this.cognitoService.signUp(this.user)
      .then(() => {
        this.loading = false;
        this.isConfirm = true;
      }).catch((error) => {
        this.snackBar.open('Failed to create your account. make sure that you have completed all the fields and try again', 'Ok');
        this.loading = false;
      });
    }
  }

  public confirmSignUp(): void {
    if (this.gender !== 'female' && this.gender !== 'male'){
      this.snackBar.open('Please select your gender', 'Ok');
    }
    else {
      this.user.gender = this.gender;
      this.loading = true;
      this.cognitoService.confirmSignUp(this.user)
      .then(() => {
        this.router.navigate(['/signIn']);
      }).catch(() => {
        this.snackBar.open('Failed to create your account. make sure that you have completed all the fields and try again', 'Ok');
        this.loading = false;
      });
    }
  }

  public setConfirmCode(confirmCode): void {
    this.user.code = confirmCode;
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
