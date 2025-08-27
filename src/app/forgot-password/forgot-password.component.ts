import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/shared/services/auth.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css'],
    standalone: false
})
export class ForgotPasswordComponent implements OnInit {
  user = null;
  gotCode = false;
  constructor(public authService: AuthService
            , private router: Router
            , private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.user = {
      name: '',
      code: '',
      password: ''
    };
  }

  public setUsername(username: string): void {
    this.user.name = username;
  }

  public setCode(code: string): void {
    this.user.code = code;
  }

  public setPassword(password: string): void {
    this.user.password = password;
  }

  public forgotPassword(): void {
    this.authService.forgotPassword(this.user.name);
    this.snackBar.open('Check your email for the code', '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['blue-snackbar'],
      duration: 10000
    });
    this.gotCode = true;
  }

  public resetPassword(): void {
    this.authService.submitNewPassword(this.user.name, this.user.code, this.user.password).then(data => {
      this.snackBar.open('Your password has been changed!', '', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['blue-snackbar'],
        duration: 5000
      });
      this.router.navigate(['/signIn']);
    }).catch(err => {

    });
  }


}
