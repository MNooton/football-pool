import { Component, OnInit } from '@angular/core';
import { IUser, AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    standalone: false
})
export class ProfileComponent implements OnInit {

  loading: boolean;
  user: IUser;

  constructor(private authService: AuthService) {
    this.loading = false;
  }

  public ngOnInit(): void {
    this.authService.getUser()
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

    this.authService.updateUser(this.user)
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
