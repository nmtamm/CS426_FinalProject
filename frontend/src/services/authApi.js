/**
 * Login.
 *
 * CONFIRMED:
 * POST /api/auth/login
 *
 * Body:
 * {
 *   username,
 *   password
 * }
 *
 * Expected:
 * {
 *   token,
 *   user
 * }
 *
 * Frontend will later store token and use it
 * for authenticated requests.
 */
export async function login(username, password) {
  // TODO: Backend implementation later.
  throw new Error("login() is not implemented yet");
}

export async function register(username, password) {
  // TODO: Backend implementation later.
  throw new Error("register() is not implemented yet");
}