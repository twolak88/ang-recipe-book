import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

@Injectable()
export class AuthEffects {
  private readonly API_KEY: string = environment.firebaseAPIKey;
  private readonly LoginAuthServerURL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword';

  constructor(private actions$: Actions,
    private httpClient: HttpClient,
    private router: Router) {}

  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) =>
        this.httpClient.post<AuthResponseData>(this.buildServiceUrl(this.LoginAuthServerURL), {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        })
        .pipe(
          map(resData => {
            const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
            return new AuthActions.Login({
              email: resData.email,
              userId: resData.localId,
              token: resData.idToken,
              expirationDate: expirationDate
            });
          }),
          catchError(errorRes => {
            return of(new AuthActions.LoginFailed(this.handleError(errorRes)));
          })
        )
      )
    )
  );

  authSuccess = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN),
      tap(() => {
        this.router.navigate(['/']);
      })
    ), { dispatch: false });

    private handleError(errorRes: HttpErrorResponse) {
      if(!errorRes.error || !errorRes.error.error) {
        return 'An unknown error occured: ' + errorRes.message;
      }
      switch(errorRes.error.error.message) {
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
    }

  private buildServiceUrl(url: string) {
    return url + '?key=' + this.API_KEY;
  }
}
