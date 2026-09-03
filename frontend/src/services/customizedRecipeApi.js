export async function getCustomizedRecipes() {
  // TODO: Backend endpoint not defined yet.
  throw new Error(
    "getCustomizedRecipes() is not implemented yet"
  );
}

export async function getCustomizedRecipeById(recipeId) {
  // TODO: Backend endpoint not defined yet.
  throw new Error(
    "getCustomizedRecipeById() is not implemented yet"
  );
}

/**
 * Create a customized recipe for the current user.
 *
 * Expected recipeData:
 * {
 *   name: string,
 *   image: string | null,
 *   instruction: string,
 *   ingredients: [
 *     {
 *       ingredientId: string,
 *       quantity: number,
 *       unit: string
 *     }
 *   ]
 * }
 *
 * Calories must be calculated by backend/database
 * from ingredient data and quantity.
 */
export async function createCustomizedRecipe(recipeData) {
  // TODO: Backend endpoint not defined yet.
  throw new Error(
    "createCustomizedRecipe() is not implemented yet"
  );
}

/**
 * Update an existing customized recipe owned by current user.
 *
 * @param {string} recipeId
 * @param {Object} recipeData
 */
export async function updateCustomizedRecipe(
  recipeId,
  recipeData
) {
  // TODO: Backend endpoint not defined yet.
  throw new Error(
    "updateCustomizedRecipe() is not implemented yet"
  );
}

export async function deleteCustomizedRecipe(recipeId) {
  // TODO: Backend endpoint not defined yet.
  throw new Error(
    "deleteCustomizedRecipe() is not implemented yet"
  );
}