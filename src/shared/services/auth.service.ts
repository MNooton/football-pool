import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  getCurrentUser,
//   currentAuthenticatedUser,
  updateUserAttributes,
  resetPassword ,
  confirmResetPassword  ,
  fetchUserAttributes
} from '@aws-amplify/auth';
import { authConfig } from '../../amplify-auth-config';

import { environment } from '../../environments/environment';

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
export class AuthService {
  public authenticationSubject = new BehaviorSubject<boolean>(false);
  public currentUser: IUser | null = null;

  constructor() {
    console.log('start auth service')
    
  }

  async signUp(user: IUser): Promise<any> {
    return signUp({
      username: user.name,
      password: user.password,
      options: {
      userAttributes: {
        email: user.email,
        gender: user.gender,
      },
    }
    });
  }

  async confirmSignUp(user: IUser): Promise<any> {
    return confirmSignUp({ username: user.name, confirmationCode: user.code});
  }

  async signIn(user: IUser): Promise<void> {
    const authUser = await signIn({ username: user.name, password: user.password });
      const attributes = await fetchUserAttributes();
    this.setUser(authUser, attributes);
    this.authenticationSubject.next(true);
  }

  async signOut(): Promise<void> {
    await signOut();
    this.authenticationSubject.next(false);
    this.currentUser = null;
  }

  async isAuthenticated(): Promise<boolean> {
    if (this.authenticationSubject.value) {
      return true;
    }
    try {
      const user = await this.getUser();
      const attributes = await fetchUserAttributes();
 
      if (user) {
        this.setUser(user, attributes);
        this.authenticationSubject.next(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async getUser(): Promise<any> {
    // currentUserInfo gives basic user info, no tokens
    return getCurrentUser();
  }

  async updateUser(user: IUser): Promise<any> {
    //const cognitoUser = await getCurrentUser();
    return updateUserAttributes({ userAttributes: { gender: user.gender}});
  }

  private setUser(user: any, attributes: any): void {
    
    this.currentUser = {
      name: user.username ?? '',
      email: attributes?.email ?? '',
      password: '',
      showPassword: false,
      code: '',
      gender: attributes?.gender ?? '',
    };
  }

  async forgotPassword(username: string): Promise<void> {
    await resetPassword({
        username: username
    });
  }

  async submitNewPassword(username: string, code: string, newPassword: string): Promise<void> {
    await confirmResetPassword ({
        username: username,
        confirmationCode: code,
        newPassword: newPassword}
    );
  }
}
