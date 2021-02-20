import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";

import { environment } from '../../../environments/environment';
import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipe.actions';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {
  readonly Service_URL = environment.dataStorageServiceAPI_URL;

  constructor(private actions$: Actions,
    private httpClient: HttpClient,
    private store: Store<fromApp.AppState>) {}

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

  storeRecipes = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.STORE_RECIPES),
      withLatestFrom(this.store.select('recipes')),
      switchMap(([actionData, recipesState]) =>
        this.httpClient.put(this.Service_URL + 'recipes.json',
          recipesState.recipes)
      )
    ), { dispatch: false }
  );
}
