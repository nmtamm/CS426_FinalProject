# Nuti Plan

**Course:** CS426 - Mobile Device Application Development
**Final Project**

Mobile app (React Native / Expo) with a FastAPI backend for ingredient-based recipe discovery, calorie calculation, custom recipes, and favorites.

## Group Info

| Student ID | Name |
|---|---|
| 23125030 | Phan Tan Dat |
| 24125042 | Nguyen Minh Tam |
| 24125055 | Tran Trung Hau |
| 24125074 | Le Gia Phuc |

GitHub repository: https://github.com/nmtamm/CS426_Seminar

## Test Credentials

The database ships with the crawled recipe/ingredient catalog only — no user accounts are pre-seeded. Register a new account from the app's **Register** screen (or `POST /api/auth/register`) before logging in. Any username/password works, for example:

- Username: `testuser`
- Password: `testpass123`

## Backend quick start

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000/docs` for the interactive API contract. On its first start, the server imports the existing scraped catalog databases into `backend/data/app.db`; this generated file is local runtime data and is not committed.

SQLite is the zero-configuration local default. For PostgreSQL, set `DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST:5432/nutriplan` in `backend/.env` before the first startup; the same SQLAlchemy models are used.

The Android emulator should use `http://10.0.2.2:8000/` as its base URL. A physical device needs the computer's LAN IP instead.

## Frontend quick start

```bash
cd frontend
yarn install
cp .env.example .env   # only needed for a physical device, see below
yarn start             # opens the Expo dev tools; press "a" for Android, "i" for iOS
```

Requires [Expo Go](https://expo.dev/go) on a physical device, or an Android/iOS emulator/simulator. With the backend already running:

- Android emulator: no changes needed, it reaches the backend at `http://10.0.2.2:8000` automatically.
- iOS simulator / web: no changes needed, it uses `http://localhost:8000`.
- Physical device: edit `frontend/.env` and set `EXPO_PUBLIC_API_URL` to the development machine's LAN IP (e.g. `http://192.168.1.172:8000`), then restart `yarn start`.

## Initial API

- `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/users/me`
- `GET /api/v1/ingredients`, `GET /api/v1/recipes`, `GET /api/v1/recipes/{id}`
- `GET|POST|PATCH|DELETE /api/v1/pantry`
- `POST /api/v1/meals/calculate`, `POST /api/v1/meals`, `GET /api/v1/meals/today`
- `GET|PUT /api/v1/goals`, `POST /api/v1/recommendations`

Calories are calculated deterministically from catalog nutrition values, and recommendations are initially ranked from pantry/recipe overlap. This keeps the core demo useful before adding an LLM or embeddings.

## Mobile search API

The screens under `frontend/src/screens` use these endpoints:

- `POST /api/auth/register` and `POST /api/auth/login`
- `GET /api/ingredients` and `GET /api/ingredients/categories`
- `GET /api/recipes` and `GET /api/recipes/categories`
- `POST /api/recipes/search-by-ingredients`

List responses use `{ items, page, limit, total, totalPages }`. The older `/api/v1` routes remain available for pantry, meals, goals, and recommendations.

The API client defaults to `http://10.0.2.2:8000` on the Android emulator and `http://localhost:8000` elsewhere. For a physical device, copy `frontend/.env.example` to `frontend/.env` and replace the host with the development computer's LAN IP.

Run backend contract tests with:

```bash
cd backend
pip install -r requirements-dev.txt
pytest -q
```
