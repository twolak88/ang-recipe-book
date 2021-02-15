import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../user.model';

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
  private readonly API_KEY: string = 'AIzaSyCc_RTtUgZvZKqrIvD3WRiEgExOX-mNdqU'
  private readonly SignupAuthServerURL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp';
  private readonly LoginAuthServerURL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword'
  user = new BehaviorSubject<User>(null);

  constructor(private httpClient: HttpClient,
    private router: Router) { }

  signup(email: string, password: string) {
    return this.httpClient.post<AuthResponseData>(this.buildServiceUrl(this.SignupAuthServerURL), {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(
      catchError(this.handleError),
      tap(
        resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        }
      )
    );
  }

  login(email: string, password: string) {
    return this.httpClient.post<AuthResponseData>(this.buildServiceUrl(this.LoginAuthServerURL), {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(
      catchError(this.handleError),
      tap(
        resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        }
      )
    );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
  }

  private buildServiceUrl(url: string) {
    return url + '?key=' + this.API_KEY;
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number, ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn);
    const user = new User(email,
      userId,
      token,
      expirationDate
    );
    this.user.next(user);
  }

  private handleError(errorRes: HttpErrorResponse) {
    if(!errorRes.error || !errorRes.error.error) {
      return throwError('An unknown error occured: ' + errorRes.message)
    }
    switch(errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        return throwError('The email address is already in use by another account.');
      case 'OPERATION_NOT_ALLOWED':
        return throwError('Password sign-in is disabled for this project.');
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        return throwError('We have blocked all requests from this device due to unusual activity. Try again later.');
      case 'EMAIL_NOT_FOUND':
        return throwError('There is no user record corresponding to this identifier.');
      case 'INVALID_PASSWORD':
        return throwError('The password is invalid or the user does not have a password.');
      case 'USER_DISABLED':
        return throwError('The user account has been disabled by an administrator.');
      default:
        return throwError('An unknown error occured: ' + errorRes.message);
    }
  }
}
