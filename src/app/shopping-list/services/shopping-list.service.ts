import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Potatos', 10)
  ];
  ingredientChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  constructor() { }

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  // addIngredient(ingredient: Ingredient) {
  //   this.ingredients.push(ingredient);
  //   this.ingredientChanged.next(this.getIngredients());
  // }

  // addIngredients(ingredients: Ingredient[]) {
  //   this.ingredients.push(...ingredients);
  //   this.ingredientChanged.next(this.getIngredients());
  // }

  // updateIngredient(index: number, ingredient: Ingredient) {
  //   this.ingredients[index] = ingredient;
  //   this.ingredientChanged.next(this.getIngredients());
  // }

  // deleteIngredient(index: number) {
  //   this.ingredients.splice(index, 1);
  //   this.ingredientChanged.next(this.getIngredients());
  // }
}
