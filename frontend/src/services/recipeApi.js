/**
 * CONFIRMED BACKEND CONTRACT
 *
 * GET /api/recipes?search=&category=&page=&limit=
 *
 * Expected response:
 * {
 *   items: Recipe[],
 *   page: number,
 *   limit: number,
 *   totalItems: number,
 *   totalPages: number
 * }
 */
export async function getRecipes({
  search = "",
  category = "",
  page = 1,
  limit = 10,
} = {}) {
  // TODO: Backend implementation later.
  throw new Error("getRecipes() is not implemented yet");
}

export async function getRecipeCategories() {
  // TODO: Backend implementation later.
  throw new Error("getRecipeCategories() is not implemented yet");
}

export async function searchRecipesByIngredients(
  ingredientIds,
  {
    search = "",
    category = "",
    page = 1,
    limit = 10,
  } = {}
) {
  // TODO: Backend implementation later.
  throw new Error(
    "searchRecipesByIngredients() is not implemented yet"
  );
}


/**
 * FRONTEND REQUIREMENT
 *
 * Backend endpoint has NOT been agreed yet.
 *
 * Purpose:
 * Load complete recipe information when
 * RecipeDetailScreen receives a recipeId.
 */
export async function getRecipeById(recipeId) {
  // TODO: Backend endpoint not defined yet.
  throw new Error("getRecipeById() is not implemented yet");
}

export async function getFavouriteRecipes() {
  // TODO: Backend endpoint not defined yet.
  throw new Error("getFavouriteRecipes() is not implemented yet");
}

export async function saveFavouriteRecipe(recipeId) {
  // TODO: Backend endpoint not defined yet.
  throw new Error("saveFavouriteRecipe() is not implemented yet");
}

export async function removeFavouriteRecipe(recipeId) {
  // TODO: Backend endpoint not defined yet.
  throw new Error(
    "removeFavouriteRecipe() is not implemented yet"
  );
}