import { Component, OnInit } from '@angular/core';
import { IUser, CognitoService } from '../../shared/services/cognito.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  loading: boolean;
  user: IUser;

  constructor(private cognitoService: CognitoService) {
    this.loading = false;
  }

  public ngOnInit(): void {
    this.cognitoService.getUser()
    .then((user: any) => {
      this.user = {
        name: user.username
        , email: user.attributes.email
        , password: ''
        , showPassword: false
        , code: ''
        , gender: user.attributes.gender
      };
    });
  }

  public update(): void {
    this.loading = true;

    this.cognitoService.updateUser(this.user)
    .then(() => {
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }

  public setUsername(username): void {
    this.user.name = username;
  }
}
