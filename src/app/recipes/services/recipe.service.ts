import { Recipe } from '../recipe.model';

export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe('A test Recipe', 'This is simply a test', 'https://c.pxhere.com/images/15/3d/9ee477ee62341b9480ce314b02f8-1417897.jpg!d'),
    new Recipe('A Second Test Recipe', 'This is second simple test recipe', 'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg')
  ];

  constructor() { }

  getRecipes() {
    return this.recipes.slice();
  }
}
