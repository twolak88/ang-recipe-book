import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinners/loading-spinner/loading-spinner.component';
import { PlaceholderDirective } from './placeholder/placeholder.directive';
import { DropdownDirective } from './dropdown.directive';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    AlertComponent,
    PlaceholderDirective,
    DropdownDirective
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    LoadingSpinnerComponent,
    AlertComponent,
    PlaceholderDirective,
    DropdownDirective,
    CommonModule
  ]
})
export class SharedModule { }
