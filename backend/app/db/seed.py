"""One-way import of the scraped SQLite catalog into the application database."""
import json
import sqlite3
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import BACKEND_DIR
from app.models import Ingredient, Recipe, RecipeIngredient


CATALOG_DIR = BACKEND_DIR / "data" / "databases"


def _number(value: object) -> float | None:
    try:
        return float(str(value).replace(",", "."))
    except (TypeError, ValueError):
        return None


def seed_catalog(db: Session) -> None:
    """Import only when the app catalog is empty, keeping application data intact."""
    if not CATALOG_DIR.exists():
        return

    ingredient_dir = CATALOG_DIR / "ingredient"
    if db.scalar(select(Ingredient.id).limit(1)) is None:
        names: set[str] = set()
        for path in sorted(ingredient_dir.glob("*.db")):
            with sqlite3.connect(path) as source:
                rows = source.execute('SELECT Food, Calories, "Default quantity", "Default unit", Image FROM ingredients').fetchall()
            for name, calories, default_quantity, default_unit, image_url in rows:
                name = str(name).strip()
                energy = _number(calories)
                if not name or energy is None or name.casefold() in names:
                    continue
                names.add(name.casefold())
                db.add(Ingredient(
                    name=name,
                    calories_per_100g=energy,
                    default_quantity=_number(default_quantity) or 100,
                    default_unit=str(default_unit or "g"),
                    image_url=str(image_url) if image_url else None,
                ))
        db.commit()

    if db.scalar(select(Recipe.id).limit(1)) is not None:
        return

    for path in sorted(CATALOG_DIR.glob("*.db")):
        with sqlite3.connect(path) as source:
            columns = {row[1] for row in source.execute("PRAGMA table_info(recipes)")}
            link_column = "link" if "link" in columns else "NULL"
            rows = source.execute(f"SELECT id, title, ingredients, {link_column}, image FROM recipes").fetchall()
        for source_id, title, raw_ingredients, link, image_url in rows:
            source_key = f"{path.name}:{source_id}"
            recipe = Recipe(title=str(title), source_key=source_key, source_url=link, image_url=image_url)
            db.add(recipe)
            db.flush()
            try:
                ingredient_rows = json.loads(raw_ingredients)
            except (TypeError, json.JSONDecodeError):
                ingredient_rows = []
            for item in ingredient_rows:
                if not isinstance(item, dict) or not item.get("name"):
                    continue
                recipe.ingredients.append(RecipeIngredient(
                    ingredient_name=str(item["name"]).strip(),
                    quantity=_number(item.get("quantity")),
                    unit=str(item["unit"]).strip() if item.get("unit") else None,
                ))
        db.commit()
