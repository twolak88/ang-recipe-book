import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators'
import { Recipe } from 'src/app/recipes/recipe.model';
import { RecipeService } from 'src/app/recipes/services/recipe.service';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  readonly Service_URL = environment.dataStorageServiceAPI_URL;
  constructor(private httpClient: HttpClient,
    private recipeService: RecipeService) { }

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
          this.recipeService.setRecipes(recipes);
        }
      ));
  }
}
