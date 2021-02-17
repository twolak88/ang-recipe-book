import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store'

import { Ingredient } from 'src/app/shared/ingredient.model';
import { Recipe } from '../recipe.model';
import { AddIngredients } from 'src/app/shopping-list/store/shopping-list.actions';
import { AppState } from 'src/app/store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  // private recipes: Recipe[] = [
  //   new Recipe(1, 'A test Recipe',
  //     'This is simply a test',
  //     'https://c.pxhere.com/images/15/3d/9ee477ee62341b9480ce314b02f8-1417897.jpg!d',
  //     [
  //       new Ingredient("Meat", 1),
  //       new Ingredient("Butter", 1),
  //       new Ingredient("Fries", 15)
  //     ]),
  //   new Recipe(2, 'A Second Test Recipe',
  //     'This is second simple test recipe',
  //     'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
  //     [
  //       new Ingredient("Tomato salad", 1),
  //       new Ingredient("Buns", 2),
  //       new Ingredient("Meat", 1)
  //     ])
  // ];
  private recipes: Recipe[] = [];
  recipeChanged = new Subject<Recipe[]>();

  constructor(private store: Store<AppState>) { }

  getRecipe(id: number) {
    return this.recipes.find(
      (recipe) => {
        return recipe.id === id;
      }
    );
  }

  getRecipes() {
    return this.recipes.slice();
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeChanged.next(this.getRecipes());
  }

  addRecipe(recipe: Recipe): number {
    recipe.id = this.recipes.length+1;
    this.recipes.push(recipe);
    this.recipeChanged.next(this.getRecipes());
    return recipe.id;
  }

  updateRecipe(id: number, recipe: Recipe) {
    const index = this.findRecipeIndex(id);
    recipe.id = id;
    this.recipes[index] = recipe;
    this.recipeChanged.next(this.getRecipes());
  }

  deleteRecipe(id:number) {
    const index = this.findRecipeIndex(id);
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.getRecipes());
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new AddIngredients(ingredients));
  }

  private findRecipeIndex(id: number): number {
    const index = this.recipes.findIndex(
      (iterRecipe) => {
        return iterRecipe.id === id;
      });
    return index;
  }
}
