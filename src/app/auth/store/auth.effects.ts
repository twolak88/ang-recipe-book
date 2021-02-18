import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { environment } from '../../../environments/environment';
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
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
    private router: Router
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
        ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
        tap(() => {
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  private buildServiceUrl(url: string) {
    return url + '?key=' + this.API_KEY;
  }
}
