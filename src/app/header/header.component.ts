import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';
import { DataStorageService } from '../shared/services/data-storage.service';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authUserSub: Subscription;
  isAuthenticated: boolean = false;

  constructor(private dataStorageService: DataStorageService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.authUserSub = this.store.select('auth').pipe(
      map(authState => {
        return authState.user;
      })
    ).subscribe(user => {
      this.isAuthenticated = !!user; //!user ? false : true;
    });
  }

  ngOnDestroy(): void {
    this.authUserSub.unsubscribe();
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
