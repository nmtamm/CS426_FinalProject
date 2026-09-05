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
    RecipeIngredient as RecipeIngredientSchema,
    CustomRecipeIngredient as CustomRecipeIngredientSchema,
)
from ..services.security import current_user
from sqlalchemy import text, case
from ..services.ingredient_search import ingredient_search

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
        ingredient_ids = ingredient_search(search)  # Ordered by score

        if ingredient_ids:
            query = query.filter(Ingredient.id.in_(ingredient_ids))

            # Map each ID to its position index to preserve semantic order
            ordering = case(
                {id_: index for index, id_ in enumerate(ingredient_ids)},
                value=Ingredient.id,
            )
            query = query.order_by(ordering)
        else:
            # Handle empty search results gracefully
            query = query.filter(False)

    if category:
        query = query.join(IngredientCategoryMapping).filter(
            IngredientCategoryMapping.category_id == category
        )

    total_items = query.count()

    ingredients = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "items": ingredients,
        "page": page,
        "limit": limit,
        "totalItems": total_items,
        "totalPages": (total_items + limit - 1) // limit,
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
        "totalItems": query.count(),
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
    category: int | None = None,
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    ingredient_ids = request_data.ingredientIds

    if not ingredient_ids:
        raise HTTPException(status_code=400, detail="Ingredient IDs are required.")

    ids_tuple = (
        f"({', '.join(map(str, ingredient_ids))})"
        if len(ingredient_ids) > 1
        else f"({ingredient_ids[0]})"
    )

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
        recipe_id = row._mapping["id"]

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

    for ingredient in custom_recipe.ingredients:
        db_ingredient = CustomDishIngredient(
            recipe_id=db_custom_recipe.id,
            ingredient_id=ingredient.id,
            quantity=ingredient.quantity,
            unit=ingredient.unit,
        )
        db.add(db_ingredient)

    db.commit()


@router.get("/custom-recipes")
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


@router.get("/recipes/favorites")
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
        CustomDishIngredient.recipe_id == custom_recipe_id
    ).delete()

    # Delete the custom recipe
    db.delete(custom_recipe)
    db.commit()


@router.get("/recipes/{recipe_id}", response_model=RecipeSchema)
def get_recipe_by_id(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found.")

    # Find the main ingredients for the recipe
    raw_main_ingredients = (
        db.query(DishIngredient)
        .join(Ingredient, DishIngredient.ingredient_id == Ingredient.id)
        .filter(DishIngredient.recipe_id == recipe_id, Ingredient.is_main == 1)
        .all()
    )

    # Make sure the main ingredients follow IngredientSchema structure
    temp_ingredients = []
    for ingredient in raw_main_ingredients:
        ingredient_name = (
            db.query(Ingredient)
            .filter(Ingredient.id == ingredient.ingredient_id)
            .first()
            .name
        )
        ingredient_image = (
            db.query(Ingredient)
            .filter(Ingredient.id == ingredient.ingredient_id)
            .first()
            .image
        )
        temp_ingredients.append(
            RecipeIngredientSchema(
                id=ingredient.ingredient_id,
                name=ingredient_name,
                quantity=ingredient.quantity,
                unit=ingredient.unit,
                image=ingredient_image,
            )
        )
    main_ingredients = temp_ingredients

    # Find the supplementary ingredients for the recipe
    raw_supplements = (
        db.query(DishIngredient)
        .join(Ingredient, DishIngredient.ingredient_id == Ingredient.id)
        .filter(DishIngredient.recipe_id == recipe_id, Ingredient.is_main == 0)
        .all()
    )

    # Make sure the supplementary ingredients follow IngredientSchema structure
    temp_supplements = []
    for ingredient in raw_supplements:
        ingredient_name = (
            db.query(Ingredient)
            .filter(Ingredient.id == ingredient.ingredient_id)
            .first()
            .name
        )
        ingredient_image = (
            db.query(Ingredient)
            .filter(Ingredient.id == ingredient.ingredient_id)
            .first()
            .image
        )
        temp_supplements.append(
            RecipeIngredientSchema(
                id=ingredient.ingredient_id,
                name=ingredient_name,
                quantity=ingredient.quantity,
                unit=ingredient.unit,
                image=ingredient_image,
            )
        )
    supplements = temp_supplements

    # Find the categories for the recipe
    categories = (
        db.query(RecipeCategory)
        .join(
            RecipeCategoryMapping,
            RecipeCategoryMapping.category_id == RecipeCategory.id,
        )
        .filter(RecipeCategoryMapping.recipe_id == recipe_id)
        .all()
    )

    # Make sure the categories follow RecipeCategorySchema structure
    categories = [
        RecipeCategorySchema(id=category.id, name=category.name, image=category.image)
        for category in categories
    ]

    # Construct the response
    recipe_response = RecipeSchema(
        id=recipe.id,
        title=recipe.title,
        instructions=recipe.instructions,
        main_ingredients=main_ingredients,
        supplements=supplements,
        image=recipe.image,
        categories=categories,
    )

    return recipe_response


@router.get("/custom-recipes/{recipe_id}", response_model=CustomRecipeSchema)
def get_custom_recipe_by_id(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(current_user),
):
    custom_recipe = (
        db.query(CustomRecipe)
        .filter(CustomRecipe.id == recipe_id, CustomRecipe.user_id == current_user.id)
        .first()
    )
    if not custom_recipe:
        raise HTTPException(status_code=404, detail="Custom recipe not found.")

    # Find the ingredients for the custom recipe
    raw_ingredients = (
        db.query(CustomDishIngredient)
        .join(Ingredient, CustomDishIngredient.ingredient_id == Ingredient.id)
        .filter(CustomDishIngredient.recipe_id == recipe_id)
        .all()
    )

    # Make sure the ingredients follow IngredientSchema structure
    ingredients = []
    for ingredient in raw_ingredients:
        ingredient_name = (
            db.query(Ingredient)
            .filter(Ingredient.id == ingredient.ingredient_id)
            .first()
            .name
        )
        ingredient_image = (
            db.query(Ingredient)
            .filter(Ingredient.id == ingredient.ingredient_id)
            .first()
            .image
        )
        ingredient_default_quantity = (
            db.query(Ingredient)
            .filter(Ingredient.id == ingredient.ingredient_id)
            .first()
            .default_quantity
        )
        ingredient_default_unit = (
            db.query(Ingredient)
            .filter(Ingredient.id == ingredient.ingredient_id)
            .first()
            .default_unit
        )
        ingredient_calories = (
            db.query(Ingredient)
            .filter(Ingredient.id == ingredient.ingredient_id)
            .first()
            .calories
        )

        ingredients.append(
            CustomRecipeIngredientSchema(
                id=ingredient.ingredient_id,
                name=ingredient_name,
                quantity=ingredient.quantity,
                unit=ingredient.unit,
                default_quantity=ingredient_default_quantity,
                default_unit=ingredient_default_unit,
                image=ingredient_image,
                calories=ingredient_calories,
            )
        )

    # Construct the response
    custom_recipe_response = CustomRecipeSchema(
        id=custom_recipe.id,
        title=custom_recipe.title,
        instructions=custom_recipe.instructions,
        ingredients=ingredients,
        image=custom_recipe.image,
    )

    return custom_recipe_response


@router.put("/custom-recipes/{recipe_id}")
def update_custom_recipe(
    recipe: CustomRecipeUpdateSchema,
    db: Session = Depends(get_db),
    current_user: int = Depends(current_user),
):
    # Check if the custom recipe exists and belongs to the current user
    db_custom_recipe = (
        db.query(CustomRecipe)
        .filter(
            CustomRecipe.id == recipe.id,
            CustomRecipe.user_id == current_user.id,
        )
        .first()
    )
    if not db_custom_recipe:
        raise HTTPException(status_code=404, detail="Custom recipe not found.")

    # Update the custom recipe fields
    db_custom_recipe.title = recipe.title
    db_custom_recipe.instructions = recipe.instructions
    db_custom_recipe.image = recipe.image if recipe.image else None

    # Delete existing ingredients for the custom recipe
    db.query(CustomDishIngredient).filter(
        CustomDishIngredient.recipe_id == recipe.id
    ).delete()

    # Add updated ingredients to the custom recipe
    for ingredient in recipe.ingredients:
        db_ingredient = CustomDishIngredient(
            recipe_id=db_custom_recipe.id,
            ingredient_id=ingredient.id,
            quantity=ingredient.quantity,
            unit=ingredient.unit,
        )
        db.add(db_ingredient)

    db.commit()


@router.delete("recipes/{recipe_id}/favorite")
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
