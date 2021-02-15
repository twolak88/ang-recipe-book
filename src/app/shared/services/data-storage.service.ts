import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, map, take, tap } from 'rxjs/operators'
import { AuthService } from 'src/app/auth/services/auth.service';
import { Recipe } from 'src/app/recipes/recipe.model';
import { RecipeService } from 'src/app/recipes/services/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  readonly Service_URL = 'https://ang-recipe-book-b5e33-default-rtdb.firebaseio.com/'
  constructor(private httpClient: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.httpClient.put(this.Service_URL + 'recipes.json',
      recipes).subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        return this.httpClient.get<Recipe[]>(this.Service_URL + 'recipes.json',
        {
          params: new HttpParams().set('auth', user.token)
        })
      }),
      map( recipes => {
        return recipes.map(recipe => {
          return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        })
      }),
      tap(
        recipes => {
          this.recipeService.setRecipes(recipes);
        }
      )
    );
  }
}
