import { Action, createReducer, on } from '@ngrx/store';
import { Ingredient } from '../shared/ingredient.model';


// export const shoppingListFeatureKey = 'shoppingList';

// export interface State {

// }

export const initialState = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Potatos', 10)
  ]
};


// export const reducer = createReducer(
//   initialState,

// );

export function shoppingListReducer(state = initialState, action: Action) {
  switch(action.type) {
    case 'ADD_INGREDIENT':
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          action
        ]
      };
  }
}
