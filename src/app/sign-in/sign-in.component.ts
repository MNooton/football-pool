import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IUser, CognitoService } from '../../shared/services/cognito.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {

  loading: boolean;
  user: IUser;

  constructor(private router: Router,
              private cognitoService: CognitoService) {
    this.loading = false;
    this.user = {
      name: '',
      email: 'mike.newton.blammo@gmail.com',
      password: 'passwordOne2!'
    } as IUser;
  }

  public signIn(): void {
    this.loading = true;
    this.cognitoService.signIn(this.user)
    .then(() => {
      this.router.navigate(['/profile']);
    }).catch(() => {
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
