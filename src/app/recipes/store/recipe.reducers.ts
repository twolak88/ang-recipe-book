import { Recipe } from '../recipe.model';

import * as RecipesActions from './recipe.actions';

export interface State {
  recipes: Recipe[];
}

const initialState = {
  recipes: [],
};

export function recipeReducer(
  state: State = initialState,
  action: RecipesActions.RecipesActions
) {
  switch (action.type) {
    case RecipesActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      };
    case RecipesActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };
    case RecipesActions.UPDATE_RECIPE:
      const index = state.recipes.findIndex(
        recipe => recipe.id === action.payload.id
      );
      const updatedRecipe = {
        ...state.recipes[index],
        ...action.payload.recipe
      };
      const updatedRecipes = [...state.recipes];
      updatedRecipes[index] = updatedRecipe;
      return {
        ...state,
        recipes: updatedRecipes
      };
    case RecipesActions.DELETE_RECIPE:

      return {
        ...state,
        recipes: state.recipes.filter(recipe =>
          recipe.id !== action.payload
        )
      };
    default:
      return state;
  }
}
