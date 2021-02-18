import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const LOGIN = '[AUTH] Login';
export const LOGOUT = '[AUTH] Logout';

export class Login implements Action {
  readonly type = LOGIN;
  constructor(public payload: {email: string, userId: string, token: string, expirationDate: Date}) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: {email: string, password: string}) {}
}

export type AuthActions = Login | Logout;
