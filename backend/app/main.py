# from contextlib import asynccontextmanager

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# # from app.api.routes import router
# from app.api.frontend_routes import router as frontend_router
# from app.core.config import settings
# from app.db.database import Base, SessionLocal, engine, migrate_legacy_schema
# from app.db.seed import seed_catalog
# import app.models  # noqa: F401 - registers SQLAlchemy models before create_all
# from app.api.cuisine_router import router as cuisine_router


# @asynccontextmanager
# async def lifespan(_: FastAPI):
#     Base.metadata.create_all(bind=engine)
#     migrate_legacy_schema()
#     with SessionLocal() as session:
#         seed_catalog(session)
#     yield


# app = FastAPI(
#     title="NutriPlan API",
#     version="0.1.0",
#     description="Mobile backend for recipes, pantry tracking, meal calories, goals, and deterministic recommendations.",
#     lifespan=lifespan,
# )
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=settings.cors_origin_list,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
# # app.include_router(router)
# app.include_router(frontend_router)
# app.include_router(cuisine_router)


# @app.get("/health", tags=["health"])
# def health():
#     return {"status": "ok", "service": "nutriplan-api"}
import uvicorn
import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

# Load environment variables
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")
from app.api.frontend_routes import router as frontend_router
from app.api.cuisine_router import router as cuisine_router

app = FastAPI(debug=True)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # This block forces the specific structural error text into your terminal
    print("!!! VALIDATION ERROR CRASH DETAILS !!!")
    print(exc.errors())
    return JSONResponse(status_code=422, content={"detail": exc.errors()})


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.10.107:5173/",
    "http://10.0.2.2",
    "android://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(frontend_router)
app.include_router(cuisine_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
