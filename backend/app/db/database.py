# from collections.abc import Generator

# from sqlalchemy import create_engine, inspect, text
# from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

# from app.core.config import settings


# class Base(DeclarativeBase):
#     pass


# connect_args = (
#     {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
# )
# engine = create_engine(settings.database_url, connect_args=connect_args)
# SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


# def migrate_legacy_schema() -> None:
#     """Add fields introduced after the first local app.db without deleting user data."""
#     inspector = inspect(engine)
#     if "ingredients" not in inspector.get_table_names():
#         return
#     migrations = {
#         "ingredients": {"category": "VARCHAR(80) NOT NULL DEFAULT 'Rau củ'"},
#         "recipes": {"category": "VARCHAR(80) NOT NULL DEFAULT 'Thịt'"},
#         "recipe_ingredients": {"is_seasoning": "BOOLEAN NOT NULL DEFAULT false"},
#     }
#     existing_columns = {
#         table: {column["name"] for column in inspector.get_columns(table)}
#         for table in migrations
#         if table in inspector.get_table_names()
#     }
#     with engine.begin() as connection:
#         for table, fields in migrations.items():
#             existing = existing_columns.get(table, set())
#             for field, sql_type in fields.items():
#                 if field not in existing:
#                     connection.execute(
#                         text(f"ALTER TABLE {table} ADD COLUMN {field} {sql_type}")
#                     )


# def get_db() -> Generator[Session, None, None]:
#     with SessionLocal() as session:
#         yield session


# database.py
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from ..models.model import UserBase

DATABASE_URL = "sqlite:///app/data/nutri_plan.db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
metadata = MetaData()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


UserBase.metadata.create_all(bind=engine)
