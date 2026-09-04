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


# POST /api/recipes/search-by-ingredients?page=&limit=
# @router.post("/recipes/search-by-ingredients")
# def search_recipes_by_ingredients(
#     request_data: IngredientSearchRequest,
#     page: int = 1,
#     limit: int = 10,
#     db: Session = Depends(get_db),
# ):
#     ingredient_ids = request_data.ingredient_ids

#     if not ingredient_ids:
#         raise HTTPException(status_code=400, detail="Ingredient IDs are required.")

#     # Get all ingredients
#     ingredients = db.query(Ingredient).all()

#     main_requested_ingredient_ids = []

#     # Keep main requested ingredients only
#     for ingredient in ingredient_ids:
#         if ingredient not in [ingredient.id for ingredient in ingredients]:
#             raise HTTPException(
#                 status_code=400, detail=f"Ingredient ID {ingredient} does not exist."
#             )

#         if ingredient in [
#             ingredient.id for ingredient in ingredients if ingredient.is_main
#         ]:
#             main_requested_ingredient_ids.append(ingredient)

#     # Get all recipes
#     recipes = db.query(Recipe).all()

#     recipes_with_all_ingredients = []

#     for recipe in recipes:
#         # Get all ingredients for the recipe
#         recipe_ingredient_ids = [
#             ingredient.id
#             for ingredient in db.query(DishIngredient)
#             .filter(DishIngredient.recipe_id == recipe.id)
#             .all()
#         ]

#         for ingredient in recipe_ingredient_ids:
#             # Chek if the ingredient is the main one
#             if ingredient not in [
#                 ingredient.id for ingredient in ingredients if ingredient.is_main
#             ]:
#                 continue

#             if recipe not in [
#                 recipe_with_ingredients["recipe"]
#                 for recipe_with_ingredients in recipes_with_all_ingredients
#             ]:
#                 recipes_with_all_ingredients.append(
#                     {
#                         "recipe": recipe,
#                         "ingredients": [ingredient],
#                     }
#                 )
#             else:
#                 for recipe_with_ingredients in recipes_with_all_ingredients:
#                     if recipe_with_ingredients["recipe"].id == recipe.id:
#                         recipe_with_ingredients["ingredients"].append(ingredient)
#                         break

#     for recipe in recipes_with_all_ingredients:
#         # Remove and sort ingredients
#         recipe["ingredients"] = sorted(set(recipe["ingredients"]))

#     ranked_recipes = []
#     for recipe in recipes_with_all_ingredients:
#         # Count the number of main ingredients in the recipe that are also in the requested ingredients
#         main_ingredients_in_recipe = [
#             ingredient
#             for ingredient in recipe["ingredients"]
#             if ingredient in main_requested_ingredient_ids
#         ]
#         existing = len(main_ingredients_in_recipe)

#         # Count the number of missing ingredients
#         ingredients = recipe["ingredients"]
#         missing = len(ingredients) - existing

#         ranked_recipes.append(
#             {
#                 "recipe": recipe["recipe"],
#                 "existing": existing,
#                 "missing": missing,
#             }
#         )

#     # Sort by missing ingredients first, then by existing ingredients
#     ranked_recipes.sort(key=lambda x: (x["missing"], -x["existing"]))

#     # Paginate the results
#     start = (page - 1) * limit

#     end = start + limit
#     paginated_recipes = ranked_recipes[start:end]
#     recipes = [recipe["recipe"] for recipe in paginated_recipes]

#     return {
#         "items": recipes,
#         "page": page,
#         "limit": limit,
#         "totalItems": len(ranked_recipes),
#         "totalPages": (len(ranked_recipes) + limit - 1) // limit,
#     }
from sqlalchemy import text


@router.post("/recipes/search-by-ingredients")
def search_recipes_by_ingredients(
    request_data: IngredientSearchRequest,
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

        recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
        if recipe is None:
            raise HTTPException(
                status_code=404, detail=f"Recipe with ID {recipe_id} not found."
            )

        recipes.append(recipe)

    return {
        "items": recipes,
        "page": page,
        "limit": limit,
        "totalItems": len(recipes),
        "totalPages": (len(recipes) + limit - 1) // limit,
    }
