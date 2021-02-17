import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './services/shopping-list.service';
import { AppState } from './store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  // ingredientChangedSub: Subscription;

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.shoppingListService.getIngredients();
    // this.ingredientChangedSub = this.shoppingListService.ingredientChanged.subscribe(
    //   (ingredients: Ingredient[]) => (this.ingredients = ingredients)
    // );
  }

  ngOnDestroy(): void {
    // this.ingredientChangedSub.unsubscribe();
  }

  onEditItem(id: number) {
    this.shoppingListService.startedEditing.next(id);
  }
}
