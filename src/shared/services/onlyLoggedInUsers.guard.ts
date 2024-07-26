import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from './cognito.service';

@Injectable()
export class  OnlyLoggedInUsersGuard  {
  constructor(private cognitoService: CognitoService, private router: Router) {}

  // tslint:disable-next-line:typedef
  // canActivate() {
  //   console.log('OnlyLoggedInUsers');
  //   if (this.cognitoService.isAuthenticated()) {
  //     console.log('Logged');
  //     return true;
  //   } else {
  //     // window.alert("You don't have permission to view this page");
  //     console.log('go to sign in');
  //     this.router.navigate(['/signIn']);
  //     return false;
  //   }
  // }
  // tslint:disable-next-line:typedef
  canActivate() {
    return this.cognitoService.isAuthenticated().then((e) => {
      if (e) {
            console.log('Logged in!');
            return true; }
        else {
            // window.alert("You don't have permission to view this page");
            console.log('go to sign in');
            this.router.navigate(['/signIn']);
            return false;
          }
    }).catch(() => false);
      // this.isAuthenticated = success;
    //   if (success) {
    //     console.log('Logged in!');
    //     return true;
    //   }else {
    //     // window.alert("You don't have permission to view this page");
    //     console.log('go to sign in');
    //     this.router.navigate(['/signIn']);
    //     return false;
    //   }
    // });
  }
}




