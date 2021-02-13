import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from 'src/app/shopping-list/services/shopping-list.service';
import { Recipe } from '../recipe.model';

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(1, 'A test Recipe',
      'This is simply a test',
      'https://c.pxhere.com/images/15/3d/9ee477ee62341b9480ce314b02f8-1417897.jpg!d',
      [
        new Ingredient("Meat", 1),
        new Ingredient("Butter", 1),
        new Ingredient("Fries", 15)
      ]),
    new Recipe(2, 'A Second Test Recipe',
      'This is second simple test recipe',
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
      [
        new Ingredient("Tomato salad", 1),
        new Ingredient("Buns", 2),
        new Ingredient("Meat", 1)
      ])
  ];
  recipeChanged = new Subject<Recipe[]>();

  constructor(private shoppingListService: ShoppingListService) { }

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

  addRecipe(recipe: Recipe) {
    recipe.id = this.recipes.length+1;
    this.recipes.push(recipe);
    this.recipeChanged.next(this.getRecipes());
  }

  updateRecipe(id: number, recipe: Recipe) {
    const index = this.recipes.findIndex(
      (iterRecipe) => {
        return iterRecipe.id === id;
      });
    recipe.id = id;
    this.recipes[index] = recipe;
    this.recipeChanged.next(this.getRecipes());
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
}
