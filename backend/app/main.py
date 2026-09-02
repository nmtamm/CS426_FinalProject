from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.api.frontend_routes import router as frontend_router
from app.core.config import settings
from app.db.database import Base, SessionLocal, engine, migrate_legacy_schema
from app.db.seed import seed_catalog
import app.models  # noqa: F401 - registers SQLAlchemy models before create_all


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    migrate_legacy_schema()
    with SessionLocal() as session:
        seed_catalog(session)
    yield


app = FastAPI(
    title="NutriPlan API",
    version="0.1.0",
    description="Mobile backend for recipes, pantry tracking, meal calories, goals, and deterministic recommendations.",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)
app.include_router(frontend_router)


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok", "service": "nutriplan-api"}
