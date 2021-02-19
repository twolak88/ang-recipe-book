import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { environment } from '../../../environments/environment';
import * as AuthActions from './auth.actions';
import { User } from '../user.model';
import { AuthService } from '../services/auth.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const localStorageAuthUserKey: string = 'authenticatedUser';
const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem(localStorageAuthUserKey, JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
  });
};

const handleError = (errorRes) => {
  return of(new AuthActions.AuthenticateFail(handleErrorMessage(errorRes)));
};

const handleErrorMessage = (errorRes) => {
  if (!errorRes.error || !errorRes.error.error) {
    return 'An unknown error occured: ' + errorRes.message;
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      return 'The email address is already in use by another account.';
    case 'OPERATION_NOT_ALLOWED':
      return 'Password sign-in is disabled for this project.';
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      return 'We have blocked all requests from this device due to unusual activity. Try again later.';
    case 'EMAIL_NOT_FOUND':
      return 'There is no user record corresponding to this identifier.';
    case 'INVALID_PASSWORD':
      return 'The password is invalid or the user does not have a password.';
    case 'USER_DISABLED':
      return 'The user account has been disabled by an administrator.';
    default:
      return 'An unknown error occured: ' + errorRes.message;
  }
};

@Injectable()
export class AuthEffects {
  private readonly API_KEY: string = environment.firebaseAPIKey;
  private readonly LoginAuthServerURL: string =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword';
  private readonly SignupAuthServerURL: string =
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp';

  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  authSignup = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupAction: AuthActions.SignupStart) =>
        this.httpClient
          .post<AuthResponseData>(
            this.buildServiceUrl(this.SignupAuthServerURL),
            {
              email: signupAction.payload.email,
              password: signupAction.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap(resData => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map((resData) =>
              handleAuthentication(
                +resData.expiresIn,
                resData.localId,
                resData.email,
                resData.idToken
              )
            ),
            catchError((errorRes) => handleError(errorRes))
          )
      )
    )
  );

  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) =>
        this.httpClient
          .post<AuthResponseData>(
            this.buildServiceUrl(this.LoginAuthServerURL),
            {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap(resData => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map((resData) =>
              handleAuthentication(
                +resData.expiresIn,
                resData.localId,
                resData.email,
                resData.idToken
              )
            ),
            catchError((errorRes) => handleError(errorRes))
          )
      )
    )
  );

  authRedirect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap(() => {
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  autoLogin = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
          const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
          } = JSON.parse(localStorage.getItem(localStorageAuthUserKey));
          if (!userData) {
            return { type: 'DUMMY' };
          }
          const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate));
          if (loadedUser.token) {
            const expirationDuration =
              new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.authService.setLogoutTimer(+expirationDuration);
            return new AuthActions.AuthenticateSuccess({
              email: loadedUser.email,
              userId: loadedUser.userId,
              token: loadedUser.token,
              expirationDate: new Date(userData._tokenExpirationDate)
            });
          } else {
            return { type: 'DUMMY' };
          }
        })
      )
  );

  authLogout = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.LOGOUT),
      tap(() => {
        this.authService.clearLogoutTimer();
        localStorage.removeItem(localStorageAuthUserKey);
        this.router.navigate(['/auth']);
      })
    ),
    { dispatch: false }
  );

  private buildServiceUrl(url: string) {
    return url + '?key=' + this.API_KEY;
  }
}
