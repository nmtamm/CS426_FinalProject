# NutriPlan

Android mobile project with a FastAPI backend for recipe discovery, pantry tracking, calorie calculation, meal logs, goals, and recipe recommendations.

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

## Initial API

- `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/users/me`
- `GET /api/v1/ingredients`, `GET /api/v1/recipes`, `GET /api/v1/recipes/{id}`
- `GET|POST|PATCH|DELETE /api/v1/pantry`
- `POST /api/v1/meals/calculate`, `POST /api/v1/meals`, `GET /api/v1/meals/today`
- `GET|PUT /api/v1/goals`, `POST /api/v1/recommendations`

Calories are calculated deterministically from catalog nutrition values, and recommendations are initially ranked from pantry/recipe overlap. This keeps the core demo useful before adding an LLM or embeddings.
