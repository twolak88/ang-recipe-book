import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from './services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  @ViewChild('authForm') authForm: NgForm;
  isLoginMode = true;
  isLoading = false;
  error = null;

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (!this.authForm.valid) {
      return;
    }
    this.isLoading = true;
    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    let authObservable: Observable<AuthResponseData>;
    if (this.isLoginMode) {
      authObservable = this.authService.login(email, password);
    } else {
      authObservable = this.authService.signup(email, password);
    }
    authObservable.subscribe(
      responseData => {
        console.log(responseData);
        this.isLoading = false;
        this.router.navigate(['/']);
      }, errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    this.authForm.reset();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onHandleError() {
    this.error = null;
  }
}
