"""One-way import of the scraped SQLite catalog into the application database."""
import json
import sqlite3
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.config import BACKEND_DIR
from app.models import Ingredient, Recipe, RecipeIngredient


CATALOG_DIR = BACKEND_DIR / "data" / "databases"

INGREDIENT_CATEGORIES = {
    "vegetables_legumes": "Rau củ", "salad": "Rau củ", "mushrooms": "Rau củ",
    "potatoes_potato_products": "Rau củ", "tofu_vegan_products": "Rau củ",
    "pork": "Thịt & Gia cầm", "beef_veal": "Thịt & Gia cầm", "meat": "Thịt & Gia cầm",
    "poultry_chicken_turkey": "Thịt & Gia cầm", "ham_sausage": "Thịt & Gia cầm",
    "fish_seafood": "Hải sản", "sushi": "Hải sản",
    "milk_dairy_products": "Trứng & Sữa", "cream_cheese": "Trứng & Sữa", "cheese": "Trứng & Sữa",
    "pasta_noodles": "Mì & Ngũ cốc", "rice_rice_products": "Mì & Ngũ cốc",
    "flour_grains_baking_ingredients": "Mì & Ngũ cốc", "cereal": "Mì & Ngũ cốc",
    "herbs_spices_tea": "Gia vị & Nêm", "fruit": "Trái cây",
    "bread_rolls_pastries": "Bánh mì & Bánh ngọt", "desserts_pudding": "Bánh mì & Bánh ngọt",
    "sweets_chocolate_cookies_candy": "Bánh mì & Bánh ngọt",
    "oils_fats": "Dầu ăn & Nước sốt", "sauces_gravy_dressing_spreads": "Dầu ăn & Nước sốt",
    "nuts_seeds": "Các loại hạt",
}

RECIPE_CATEGORIES = {
    "mon_com": "Cơm & Mì", "mon_nuoc": "Cơm & Mì", "mon_cuon_tron": "Cơm & Mì",
    "mon_canh": "Canh & Súp", "mon_sup": "Canh & Súp", "mon_chao": "Canh & Súp", "mon_lau": "Canh & Súp",
    "mon_chay": "Rau", "mon_goi_tron": "Rau",
    "mon_banh": "Bánh & Bánh mì", "mon_trang_mieng": "Tráng miệng", "mon_che": "Tráng miệng", "mon_kem": "Tráng miệng",
    "thuc_uong": "Đồ uống", "nuoc_ep": "Đồ uống", "sinh_to": "Đồ uống", "tra_sua": "Đồ uống",
    "an_vat": "Đồ ăn vặt", "ngay_le_tet": "Đồ ăn vặt",
}


def _recipe_category(path: Path, ingredient_rows: list[dict] | None = None) -> str:
    key = path.stem.replace("-", "_")
    mapped = RECIPE_CATEGORIES.get(key)
    if mapped:
        return mapped
    ingredient_text = " ".join(
        str(item.get("name", "")).casefold()
        for item in (ingredient_rows or []) if isinstance(item, dict)
    )
    if any(name in ingredient_text for name in ("cá", "tôm", "mực", "cua", "ốc", "hải sản")):
        return "Hải sản"
    return "Thịt"


def _number(value: object) -> float | None:
    try:
        return float(str(value).replace(",", "."))
    except (TypeError, ValueError):
        return None


def _backfill_categories(db: Session) -> None:
    ingredient_needs_backfill = len(
        db.scalars(select(Ingredient.category).distinct().limit(2)).all()
    ) < 2
    recipe_needs_backfill = len(
        db.scalars(select(Recipe.category).distinct().limit(2)).all()
    ) < 2
    if ingredient_needs_backfill:
        ingredient_categories: dict[str, str] = {}
        for path in sorted((CATALOG_DIR / "ingredient").glob("*.db")):
            category = INGREDIENT_CATEGORIES.get(path.stem, "Rau củ")
            with sqlite3.connect(path) as source:
                for (name,) in source.execute("SELECT Food FROM ingredients"):
                    ingredient_categories[str(name).strip().casefold()] = category
        for ingredient in db.scalars(select(Ingredient)).all():
            ingredient.category = ingredient_categories.get(ingredient.name.casefold(), ingredient.category)
    if recipe_needs_backfill:
        recipes = db.scalars(
            select(Recipe).options(selectinload(Recipe.ingredients))
        ).all()
        for recipe in recipes:
            source_file = recipe.source_key.split(":", 1)[0]
            recipe.category = _recipe_category(
                Path(source_file), [{"name": item.ingredient_name} for item in recipe.ingredients]
            )
    if ingredient_needs_backfill or recipe_needs_backfill:
        db.commit()


def seed_catalog(db: Session) -> None:
    """Import only when the app catalog is empty, keeping application data intact."""
    if not CATALOG_DIR.exists():
        return

    ingredient_dir = CATALOG_DIR / "ingredient"
    if db.scalar(select(Ingredient.id).limit(1)) is None:
        names: set[str] = set()
        for path in sorted(ingredient_dir.glob("*.db")):
            category = INGREDIENT_CATEGORIES.get(path.stem, "Rau củ")
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
                    category=category,
                    calories_per_100g=energy,
                    default_quantity=_number(default_quantity) or 100,
                    default_unit=str(default_unit or "g"),
                    image_url=str(image_url) if image_url else None,
                ))
        db.commit()

    if db.scalar(select(Recipe.id).limit(1)) is not None:
        _backfill_categories(db)
        return

    for path in sorted(CATALOG_DIR.glob("*.db")):
        with sqlite3.connect(path) as source:
            columns = {row[1] for row in source.execute("PRAGMA table_info(recipes)")}
            link_column = "link" if "link" in columns else "NULL"
            seasoning_column = "seasoning" if "seasoning" in columns else "NULL"
            rows = source.execute(
                f"SELECT id, title, ingredients, {seasoning_column}, {link_column}, image FROM recipes"
            ).fetchall()
        for source_id, title, raw_ingredients, raw_seasoning, link, image_url in rows:
            source_key = f"{path.name}:{source_id}"
            try:
                ingredient_rows = json.loads(raw_ingredients)
            except (TypeError, json.JSONDecodeError):
                ingredient_rows = []
            recipe = Recipe(
                title=str(title), category=_recipe_category(path, ingredient_rows), source_key=source_key,
                source_url=link, image_url=image_url,
            )
            db.add(recipe)
            db.flush()
            try:
                seasoning_rows = json.loads(raw_seasoning) if raw_seasoning else []
            except (TypeError, json.JSONDecodeError):
                seasoning_rows = []
            seasoning_names = {
                str(item.get("name", "")).strip().casefold()
                for item in seasoning_rows if isinstance(item, dict)
            }
            for item in ingredient_rows:
                if not isinstance(item, dict) or not item.get("name"):
                    continue
                recipe.ingredients.append(RecipeIngredient(
                    ingredient_name=str(item["name"]).strip(),
                    quantity=_number(item.get("quantity")),
                    unit=str(item["unit"]).strip() if item.get("unit") else None,
                    is_seasoning=str(item["name"]).strip().casefold() in seasoning_names,
                ))
        db.commit()
    _backfill_categories(db)
