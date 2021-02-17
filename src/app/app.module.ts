import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store'

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { appReducer } from './store/app.reducer';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(appReducer),
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
