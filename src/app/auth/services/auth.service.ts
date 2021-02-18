import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../user.model';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import * as AuthActions from '../store/auth.actions';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_KEY: string = environment.firebaseAPIKey;
  private readonly SignupAuthServerURL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp';
  private readonly LoginAuthServerURL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword'
  private readonly LocalStorageAuthUserKey: string = 'authenticatedUser';
  private tokenExpirationTimer: any;

  constructor(private httpClient: HttpClient,
    private router: Router,
    private store: Store<AppState>) { }

  // signup(email: string, password: string) {
  //   return this.httpClient.post<AuthResponseData>(this.buildServiceUrl(this.SignupAuthServerURL), {
  //     email: email,
  //     password: password,
  //     returnSecureToken: true
  //   }).pipe(
  //     catchError(this.handleError),
  //     tap(
  //       resData => {
  //         this.handleAuthentication(
  //           resData.email,
  //           resData.localId,
  //           resData.idToken,
  //           +resData.expiresIn
  //         );
  //       }
  //     )
  //   );
  // }

  // login(email: string, password: string) {
  //   return this.httpClient.post<AuthResponseData>(this.buildServiceUrl(this.LoginAuthServerURL), {
  //     email: email,
  //     password: password,
  //     returnSecureToken: true
  //   }).pipe(
  //     catchError(this.handleError),
  //     tap(
  //       resData => {
  //         this.handleAuthentication(
  //           resData.email,
  //           resData.localId,
  //           resData.idToken,
  //           +resData.expiresIn
  //         );
  //       }
  //     )
  //   );
  // }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
    // this.router.navigate(['/auth']);
    localStorage.removeItem(this.LocalStorageAuthUserKey);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem(this.LocalStorageAuthUserKey));
    if (!userData) {
      return;
    }
    const expirationDate = new Date(userData._tokenExpirationDate);
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      expirationDate);
    if (loadedUser.token) {
      this.store.dispatch(new AuthActions.AuthenticateSuccess({
        email: loadedUser.email,
        userId: loadedUser.userId,
        token: loadedUser.token,
        expirationDate:expirationDate
      }));
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  // private handleAuthentication(email: string, userId: string, token: string, expiresIn: number, ) {
  //   const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  //   const user = new User(email,
  //     userId,
  //     token,
  //     expirationDate
  //   );
  //   this.store.dispatch(new AuthActions.AuthenticateSuccess({
  //     email: user.email,
  //     userId: user.userId,
  //     token: user.token,
  //     expirationDate: expirationDate
  //   }));
  //   this.autoLogout(expiresIn * 1000);
  //   localStorage.setItem(this.LocalStorageAuthUserKey, JSON.stringify(user));
  // }

  // private buildServiceUrl(url: string) {
  //   return url + '?key=' + this.API_KEY;
  // }

  // private handleError(errorRes: HttpErrorResponse) {
  //   if(!errorRes.error || !errorRes.error.error) {
  //     return throwError('An unknown error occured: ' + errorRes.message)
  //   }
  //   switch(errorRes.error.error.message) {
  //     case 'EMAIL_EXISTS':
  //       return throwError('The email address is already in use by another account.');
  //     case 'OPERATION_NOT_ALLOWED':
  //       return throwError('Password sign-in is disabled for this project.');
  //     case 'TOO_MANY_ATTEMPTS_TRY_LATER':
  //       return throwError('We have blocked all requests from this device due to unusual activity. Try again later.');
  //     case 'EMAIL_NOT_FOUND':
  //       return throwError('There is no user record corresponding to this identifier.');
  //     case 'INVALID_PASSWORD':
  //       return throwError('The password is invalid or the user does not have a password.');
  //     case 'USER_DISABLED':
  //       return throwError('The user account has been disabled by an administrator.');
  //     default:
  //       return throwError('An unknown error occured: ' + errorRes.message);
  //   }
  // }
}
