from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..models.model import (
    Recipe,
    RecipeCategory,
    Ingredient,
    IngredientCategory,
    DishIngredient,
    CustomRecipe,
    FavoriteRecipe,
    CustomDishIngredient,
    RecipeCategoryMapping,
    IngredientCategoryMapping,
)

from ..schemas.schema import (
    Recipe as RecipeSchema,
    Ingredient as IngredientSchema,
    RecipeCategory as RecipeCategorySchema,
    IngredientCategory as IngredientCategorySchema,
    CustomRecipe as CustomRecipeSchema,
    CustomRecipeCreate as CustomRecipeCreateSchema,
    CustomRecipeUpdate as CustomRecipeUpdateSchema,
    IngredientSearchRequest,
)
from ..services.security import current_user
from sqlalchemy import text

router = APIRouter(prefix="/api")


# GET /api/ingredients?search=&category=&page=&limit=
@router.get("/ingredients")
def get_ingredients(
    search: str | None = None,
    category: int | None = None,
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    query = db.query(Ingredient)
    if search:
        query = query.filter(Ingredient.name.ilike(f"%{search}%"))
    if category:
        query = query.join(IngredientCategoryMapping).filter(
            IngredientCategoryMapping.category_id == category
        )
    ingredients = query.offset((page - 1) * limit).limit(limit).all()
    return {
        "items": ingredients,
        "page": page,
        "limit": limit,
        "totalItems": query.count(),  # Calculate database count
        "totalPages": (query.count() + limit - 1) // limit,
    }


# GET /api/ingredients/categories
@router.get("/ingredients/categories", response_model=list[IngredientCategorySchema])
def get_ingredient_categories(db: Session = Depends(get_db)):
    categories = db.query(IngredientCategory).all()
    return categories


# GET /api/recipes?search=&category=&page=&limit=
@router.get("/recipes")
def get_recipes(
    search: str | None = None,
    category: int | None = None,
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    query = db.query(Recipe)
    if search:
        query = query.filter(Recipe.title.ilike(f"%{search}%"))
    if category and category != 0:  # Assuming 0 is the ID for "Tất cả" (All)
        query = query.join(RecipeCategoryMapping).filter(
            RecipeCategoryMapping.category_id == category
        )
    recipes = query.offset((page - 1) * limit).limit(limit).all()
    return {
        "items": recipes,
        "page": page,
        "limit": limit,
        "totalItems": query.count(),  # Calculate database count
        "totalPages": (query.count() + limit - 1) // limit,
    }


# GET /api/recipes/categories
@router.get("/recipes/categories", response_model=list[RecipeCategorySchema])
def get_recipe_categories(db: Session = Depends(get_db)):
    categories = db.query(RecipeCategory).all()
    return categories


@router.post("/recipes/search-by-ingredients")
def search_recipes_by_ingredients(
    request_data: IngredientSearchRequest,
    category: int | None = None,  # This is for recipes category filtering, if needed
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    ingredient_ids = request_data.ingredientIds  # adjust to match your schema setup

    if not ingredient_ids:
        raise HTTPException(status_code=400, detail="Ingredient IDs are required.")

    # Convert Python list to a safe SQL-compatible string format: (1, 2, 3)
    # If there's only 1 item, trailing comma avoids syntax issues in SQL 'IN' clauses
    ids_tuple = (
        f"({', '.join(map(str, ingredient_ids))})"
        if len(ingredient_ids) > 1
        else f"({ingredient_ids[0]})"
    )

    # Raw SQL Query doing all ranking, counting, and sorting in SQLite memory
    sql_query = text(f"""
        SELECT r.*,
               COUNT(DISTINCT CASE WHEN di.ingredient_id IN {ids_tuple} THEN di.ingredient_id END) AS existing,
               (COUNT(DISTINCT di.ingredient_id) - COUNT(DISTINCT CASE WHEN di.ingredient_id IN {ids_tuple} THEN di.ingredient_id END)) AS missing
        FROM recipes r
        JOIN dish_ingredients di ON r.id = di.recipe_id
        JOIN ingredients i ON di.ingredient_id = i.id
        WHERE i.is_main = 1
        GROUP BY r.id
        HAVING existing > 0
        ORDER BY missing ASC, existing DESC
        LIMIT :limit OFFSET :offset
    """)

    # 1. Execute your raw ranking query with pagination parameters
    offset = (page - 1) * limit
    result = db.execute(sql_query, {"limit": limit, "offset": offset}).all()

    # 2. Iterate through the results and map them to full Recipe objects
    recipes = []
    for row in result:
        # Fix: Use row._mapping to safely read the 'id' by its string name
        recipe_id = row._mapping["id"]

        # Only fetch recipes if it belong to the specified category (if provided)
        if category and category != 0:
            recipe_category = (
                db.query(RecipeCategoryMapping)
                .filter(
                    RecipeCategoryMapping.recipe_id == recipe_id,
                    RecipeCategoryMapping.category_id == category,
                )
                .first()
            )
            if not recipe_category:
                continue
        recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()

        recipes.append(recipe)

    return {
        "items": recipes,
        "page": page,
        "limit": limit,
        "totalItems": len(recipes),
        "totalPages": (len(recipes) + limit - 1) // limit,
    }


@router.post("/custom-recipes")
def create_custom_recipe(
    custom_recipe: CustomRecipeCreateSchema,
    db: Session = Depends(get_db),
    current_user: int = Depends(current_user),
):
    db_custom_recipe = CustomRecipe(
        user_id=current_user.id,
        title=custom_recipe.title,
        instructions=custom_recipe.instructions,
        image=custom_recipe.image if custom_recipe.image else None,
    )
    db.add(db_custom_recipe)
    db.commit()
    db.refresh(db_custom_recipe)

    # Add ingredients to the custom recipe
    for ingredient in custom_recipe.ingredients:
        db_ingredient = CustomDishIngredient(
            custom_recipe_id=db_custom_recipe.id,
            ingredient_id=ingredient.ingredient_id,
            quantity=ingredient.quantity,
            unit=ingredient.unit,
        )
        db.add(db_ingredient)

    db.commit()


@router.get("/custom-recipes", response_model=list[CustomRecipeSchema])
def get_custom_recipes(
    db: Session = Depends(get_db),
    current_user: int = Depends(current_user),
):
    custom_recipes = (
        db.query(CustomRecipe).filter(CustomRecipe.user_id == current_user.id).all()
    )
    return custom_recipes


@router.post("/recipes/{recipe_id}/favorite")
def favorite_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(current_user),
):
    # Check if the recipe exists
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found.")

    # Check if the user has already favorited this recipe
    existing_favorite = (
        db.query(FavoriteRecipe)
        .filter(
            FavoriteRecipe.user_id == current_user.id,
            FavoriteRecipe.recipe_id == recipe_id,
        )
        .first()
    )
    if existing_favorite:
        raise HTTPException(status_code=400, detail="Recipe already favorited.")

    # Create a new favorite entry
    favorite = FavoriteRecipe(user_id=current_user.id, recipe_id=recipe_id)
    db.add(favorite)
    db.commit()


@router.get("/recipes/favorites", response_model=list[RecipeSchema])
def get_favorite_recipes(
    db: Session = Depends(get_db),
    current_user: int = Depends(current_user),
):
    favorite_recipes = (
        db.query(Recipe)
        .join(FavoriteRecipe, FavoriteRecipe.recipe_id == Recipe.id)
        .filter(FavoriteRecipe.user_id == current_user.id)
        .all()
    )
    return favorite_recipes


@router.delete("/recipes/{recipe_id}/favorite")
def unfavorite_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(current_user),
):
    # Check if the favorite entry exists
    favorite = (
        db.query(FavoriteRecipe)
        .filter(
            FavoriteRecipe.user_id == current_user.id,
            FavoriteRecipe.recipe_id == recipe_id,
        )
        .first()
    )
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite entry not found.")

    # Delete the favorite entry
    db.delete(favorite)
    db.commit()


@router.delete("/custom-recipes/{custom_recipe_id}")
def delete_custom_recipe(
    custom_recipe_id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(current_user),
):
    # Check if the custom recipe exists and belongs to the current user
    custom_recipe = (
        db.query(CustomRecipe)
        .filter(
            CustomRecipe.id == custom_recipe_id,
            CustomRecipe.user_id == current_user.id,
        )
        .first()
    )
    if not custom_recipe:
        raise HTTPException(status_code=404, detail="Custom recipe not found.")

    # Delete associated ingredients first due to foreign key constraints
    db.query(CustomDishIngredient).filter(
        CustomDishIngredient.custom_recipe_id == custom_recipe_id
    ).delete()

    # Delete the custom recipe
    db.delete(custom_recipe)
    db.commit()
