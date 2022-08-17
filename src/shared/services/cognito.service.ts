import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Amplify, { Auth } from 'aws-amplify';

import { environment } from '../../environments/environment';
import { EmailValidator } from '@angular/forms';


export interface IUser {
  email: string;
  password: string;
  showPassword: boolean;
  code: string;
  name: string;
  gender: string;
}

@Injectable({
  providedIn: 'root',
})
export class CognitoService {

  public authenticationSubject: BehaviorSubject<any>;
  public currentUser: IUser;

  constructor() {
    Amplify.configure({
      Auth: environment.cognito,
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

  public signUp(user: IUser): Promise<any> {
    return Auth.signUp({
      username: user.name,
      password: user.password,
      attributes: { email: user.email, gender: user.gender },
    });
  }

  public confirmSignUp(user: IUser): Promise<any> {
    console.log({ e: user.email, c: user.code, u: user.name });
    return Auth.confirmSignUp(user.name, user.code);
  }

  public signIn(user: IUser): Promise<any> {
    return Auth.signIn({ username: user.name, password: user.password})
    .then((currentUser) => {
      this.currentUser = currentUser;
      this.authenticationSubject.next(true);
    });
  }

  public signOut(): Promise<any> {
    return Auth.signOut()
    .then(() => {
      this.authenticationSubject.next(false);
    });
  }

  public isAuthenticated(): Promise<boolean> {
    if (this.authenticationSubject.value) {
      console.log({ message: 'I am authenticated.', obj: this.authenticationSubject.value});
     // this.getAllUsers();
      return Promise.resolve(true);
    } else {
      console.log({ message: 'I am not authenticated.', obj: this.authenticationSubject.value});
      return this.getUser()
      .then((user: any) => {
        if (user) {
          this.setUser(user);
          this.authenticationSubject.next(true);
          return true;
        } else {
          return false;
        }
      }).catch(() => {
        return false;
      });
    }
  }

  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  public updateUser(user: IUser): Promise<any> {
    return Auth.currentUserPoolUser()
    .then((cognitoUser: any) => {
      return Auth.updateUserAttributes(cognitoUser, user);
    });
  }

  private setUser(user): void {
    this.currentUser = {
      name: user.username,
      email: user.attributes.email,
      password: '',
      showPassword: false,
      code: '',
      gender: user.attributes.gender
    };
  }

  public getAllUsers(): void { // NOT WORKING, credentials aren't being supplied
    const AWS = require('aws-sdk');

    const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
      apiVersion: '2016-04-18',
      region: 'us-west-2'
      // credentials: Auth.essentialCredentials(credentials)
    });
    const params = {
      UserPoolId: environment.cognito.userPoolId, /* required */
      AttributesToGet: [
        'email',
      ],
      Limit: 0
    };
    // tslint:disable-next-line:typedef
    // tslint:disable-next-line:only-arrow-functions
    // tslint:disable-next-line:typedef
    cognitoidentityserviceprovider.listUsers(params, (err, data) => {
        if (err) { console.log(err, err.stack); } // an error occurred
        else { console.log(data); } // successful response
      });

 }
}

