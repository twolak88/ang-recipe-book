import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators'

import { Recipe } from 'src/app/recipes/recipe.model';
import { RecipeService } from 'src/app/recipes/services/recipe.service';
import { environment } from '../../../environments/environment'
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../../recipes/store/recipe.actions'

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  readonly Service_URL = environment.dataStorageServiceAPI_URL;
  constructor(private httpClient: HttpClient,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.httpClient.put(this.Service_URL + 'recipes.json',
      recipes).subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.httpClient.get<Recipe[]>(this.Service_URL + 'recipes.json')
      .pipe(map( recipes => {
        return recipes.map(recipe => {
          return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        })
      }),
      tap(
        recipes => {
          this.store.dispatch(new RecipesActions.SetRecipes(recipes));
        }
      ));
  }
}
