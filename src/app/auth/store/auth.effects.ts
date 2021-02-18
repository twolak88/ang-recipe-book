import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';

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
    private httpClient: HttpClient) {}

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
          // catchError(error => {
          //   //...
          //   return of();
          // })
        )
      )
    )
  );

  private buildServiceUrl(url: string) {
    return url + '?key=' + this.API_KEY;
  }
}
