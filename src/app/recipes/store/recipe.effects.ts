import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment'
import * as RecipesActions from './recipe.actions'
import { Recipe } from "../recipe.model";
import { Injectable } from "@angular/core";

@Injectable()
export class RecipeEffects {
  readonly Service_URL = environment.dataStorageServiceAPI_URL;

  constructor(private actions$: Actions,
    private httpClient: HttpClient) {}

  fetchRecipes = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap(() =>
        this.httpClient.get<Recipe[]>(this.Service_URL + 'recipes.json')
      ),
      map(recipes => recipes.map(recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        }
      }
      )),
      map((recipes: Recipe[]) => new RecipesActions.SetRecipes(recipes))
    )
  );
}
