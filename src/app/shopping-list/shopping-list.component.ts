import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from '../shared/ingredient.model';
import { AppState } from './store/shopping-list.reducer';
import { StartEdit } from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  // ingredientChangedSub: Subscription;

  constructor(
    /*private shoppingListService: ShoppingListService,*/
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

  onEditItem(index: number) {
    // this.shoppingListService.startedEditing.next(id);
    this.store.dispatch(new StartEdit(index));
  }
}
