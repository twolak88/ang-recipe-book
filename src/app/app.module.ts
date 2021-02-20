import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { StoreRouterConnectingModule } from '@ngrx/router-store'
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { appReducer } from './store/app.reducer';
import { AuthEffects } from './auth/store/auth.effects';
import { environment } from '../environments/environment';
import { RecipeEffects } from './recipes/store/recipe.effects';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([
      AuthEffects,
      RecipeEffects
    ]),
    StoreDevtoolsModule.instrument({logOnly: environment.production}),
    StoreRouterConnectingModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    CoreModule
  ],
  bootstrap: [AppComponent], //starting component
  // entryComponents: [ //deprected in Angular 9, rendering engine Ivy
  //   AlertComponent
  // ]
})
export class AppModule { }
