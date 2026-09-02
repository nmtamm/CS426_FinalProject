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
  if (options.body) headers["Content-Type"] = "application/json";
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
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
    body: JSON.stringify({ username: username.trim(), password }),
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
  searchRecipesByIngredients: ({ ingredientIds, ...parameters }) =>
    request(`/api/recipes/search-by-ingredients${queryString(parameters)}`, {
      method: "POST",
      body: JSON.stringify({ ingredientIds }),
    }),
};
