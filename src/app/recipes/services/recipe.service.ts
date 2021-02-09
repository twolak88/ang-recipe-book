import { EventEmitter } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Recipe } from '../recipe.model';

export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe('A test Recipe',
      'This is simply a test',
      'https://c.pxhere.com/images/15/3d/9ee477ee62341b9480ce314b02f8-1417897.jpg!d',
      [
        new Ingredient("Meat", 1),
        new Ingredient("Butter", 1),
        new Ingredient("Fries", 15)
      ]),
    new Recipe('A Second Test Recipe',
      'This is second simple test recipe',
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
      [
        new Ingredient("Tomato salad", 1),
        new Ingredient("Buns", 2),
        new Ingredient("Meat", 1)
      ])
  ];
  recipeSelected = new EventEmitter<Recipe>();

  constructor() { }

  getRecipes() {
    return this.recipes.slice();
  }
}
