import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from 'src/app/recipes/recipe.model';
import { RecipeService } from 'src/app/recipes/services/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  readonly Service_URL = 'https://ang-recipe-book-b5e33-default-rtdb.firebaseio.com/'
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
    this.httpClient.get<Recipe[]>(this.Service_URL + 'recipes.json')
      .subscribe(recipes => {
        this.recipeService.setRecipes(recipes);
      })
  }
}