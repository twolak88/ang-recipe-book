import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { AddIngredient, DeleteIngredient, StopEdit, UpdateIngredient } from '../store/shopping-list.actions';
import { AppState } from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('formEl', {static: false}) form: NgForm;
  editingSubscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.editingSubscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.form.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.editingSubscription.unsubscribe();
    this.store.dispatch(new StopEdit());
  }

  onSubmit() {
    const value = this.form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode) {
      this.store.dispatch(new UpdateIngredient(newIngredient));
    } else {
      this.store.dispatch(new AddIngredient(newIngredient));
    }
    this.reset();
  }

  onClear() {
    this.reset();
  }

  onDelete() {
    if (confirm('Are you sure you want to delete ingredient?')) {
      this.store.dispatch(new DeleteIngredient());
      this.reset();
    }
  }

  reset() {
    this.form.reset();
    this.store.dispatch(new StopEdit());
    this.editedItem = null;
    this.editMode = false;
  }
}
