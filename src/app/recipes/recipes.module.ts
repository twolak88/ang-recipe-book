import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipesComponent } from './recipes.component';
import { SelectionMessageComponent } from './selection-message/selection-message.component';



@NgModule({
  declarations: [
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    RecipeEditComponent,
    SelectionMessageComponent
  ],
  imports: [
    ReactiveFormsModule,
    RecipesRoutingModule,
    SharedModule
  ]
})
export class RecipesModule { }
