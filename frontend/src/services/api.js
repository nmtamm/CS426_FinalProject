import { Platform } from "react-native";

const localHost =
  Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://localhost:8000";
export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || localHost
).replace(/\/$/, "");

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

function queryString(parameters) {
  const query = new URLSearchParams();
  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  const encoded = query.toString();
  return encoded ? `?${encoded}` : "";
}

async function request(path, options = {}) {
  const headers = { Accept: "application/json", ...options.headers };

  // 🌟 FIX 1: Create a safe mutable copy of options
  const fetchOptions = { ...options };

  if (fetchOptions.body) {
    headers["Content-Type"] = "application/json";

    // 🌟 FIX 2: Automatically stringify bodies if they are objects
    if (typeof fetchOptions.body === "object") {
      fetchOptions.body = JSON.stringify(fetchOptions.body);
    }
  }

  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  let response;
  try {
    // 🌟 FIX 3: Pass fetchOptions instead of raw options
    response = await fetch(`${API_BASE_URL}${path}`, { ...fetchOptions, headers });
  } catch {
    throw new Error(`Không thể kết nối API tại ${API_BASE_URL}`);
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = payload?.detail;
    const message = Array.isArray(detail)
      ? detail.map((item) => item.msg).join(", ")
      : detail || "Yêu cầu không thành công";
    throw new Error(message);
  }
  return payload;
}

async function authenticate(endpoint, username, password) {
  const result = await request(endpoint, {
    method: "POST",
    body: { username: username.trim(), password }, // Passed cleanly as object
  });
  setAuthToken(result.token);
  return result;
}

export const api = {
  login: (username, password) =>
    authenticate("/api/auth/login", username, password),
  register: (username, password) =>
    authenticate("/api/auth/register", username, password),
  getIngredientCategories: () => request("/api/ingredients/categories"),
  getIngredients: (parameters) =>
    request(`/api/ingredients${queryString(parameters)}`),
  getRecipeCategories: () => request("/api/recipes/categories"),
  getRecipes: (parameters) => request(`/api/recipes${queryString(parameters)}`),

  getRecipeById: (recipeId) => request(`/api/recipes/${recipeId}`),

  // Favourite recipes
  getFavouriteRecipes: () => request("/api/recipes/favorites"),

  isFavouriteRecipe: (recipeId) => request(`/api/recipe/${recipeId}/favourite`),

  saveFavouriteRecipe: (recipeId) =>
    request(`/api/recipes/${recipeId}/favorite`, {
      method: "POST",
      body: {},
    }),

  removeFavouriteRecipe: (recipeId) =>
    request(`/api/recipes/${recipeId}/favorite`, {
      method: "DELETE",
    }),

  // Customized recipes
  getCustomizedRecipes: () => request("/api/custom-recipes"), // 🌟 Standardized to GET (no body)

  getCustomizedRecipeById: (recipeId) => request(`/api/custom-recipes/${recipeId}`), // 🌟 Standardized to GET (no body)

  createCustomizedRecipe: (recipeData) =>
    request("/api/custom-recipes", {
      method: "POST",
      body: recipeData, // Object maps smoothly now!
    }),

  updateCustomizedRecipe: (recipeId, recipeData) =>
    request(`/api/custom-recipes/${recipeId}`, {
      method: "PUT",
      body: recipeData,
    }),

  deleteCustomizedRecipe: (recipeId) =>
    request(`/api/custom-recipes/${recipeId}`, {
      method: "DELETE",
    }),

  searchRecipesByIngredients: (ingredientIds, parameters = {}) =>
    request(`/api/recipes/search-by-ingredients${queryString(parameters)}`, {
      method: "POST",
      body: { ingredientIds },
    }),

  // Profile
  getProfile: () => request("/api/users/me"),

  updateFullName: (fullName) =>
    request("/api/users/me", {
      method: "PUT",
      body: {
        fullName: fullName.trim(),
      },
    }),

  updatePassword: (password) =>
    request("/api/users/me/password", {
      method: "PUT",
      body: {
        password,
      },
    }),
};
