import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AuthServerURL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCc_RTtUgZvZKqrIvD3WRiEgExOX-mNdqU';
  constructor(private httpClient: HttpClient) { }

  signup(email: string, password: string) {
    return this.httpClient.post<AuthResponseData>(this.AuthServerURL, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(
      catchError(
        errorRes => {
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
            default:
              return throwError('An unknown error occured: ' + errorRes.message);
          }
        }
      )
    );
  }
}
