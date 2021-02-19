import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Actions, ofType } from "@ngrx/effects";
import { take } from 'rxjs/operators';

import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipe.actions';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]>{

  constructor(private store: Store<fromApp.AppState>,
    private actions$: Actions) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    // let retRecipes = [];
    // this.store.select('recipes')
    // .pipe(map(recipesState => recipesState.recipes))
    // .subscribe((recipes: Recipe[]) =>
    //   retRecipes = recipes
    // );
    // if (retRecipes.length > 0) {
    //   return retRecipes;
    // }

    this.store.dispatch(new RecipesActions.FetchRecipes());
    return this.actions$.pipe(
        ofType(RecipesActions.SET_RECIPES),
        take(1)
      );
  }
}
