import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { DataStorageService } from '../shared/services/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authUserSub: Subscription;
  isAuthenticated: boolean = false;

  constructor(private dataStorageService: DataStorageService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.authUserSub = this.authService.user.subscribe(user => {
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
}
