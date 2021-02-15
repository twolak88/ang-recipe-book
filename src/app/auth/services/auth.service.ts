import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface AuthResponseData {
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
  readonly AuthServerURL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCc_RTtUgZvZKqrIvD3WRiEgExOX-mNdqU';
  constructor(private httpClient: HttpClient) { }

  signup(email: string, password: string) {
    return this.httpClient.post<AuthResponseData>(this.AuthServerURL, {
      email: email,
      password: password,
      returnSecureToken: true
    })
  }
}
