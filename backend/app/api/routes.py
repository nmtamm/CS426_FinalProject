# import re
# from datetime import date

# from fastapi import APIRouter, Depends, HTTPException, Query, status
# from sqlalchemy import func, or_, select
# from sqlalchemy.orm import Session, selectinload

# from app.db.database import get_db
# from app.models import Ingredient, Meal, MealItem, PantryItem, Recipe, User, UserGoal
# from app.schemas.contracts import (
#     GoalResponse, GoalUpsert, IngredientResponse, LoginRequest, MealCalculationRequest, MealCreate, MealResponse,
#     PantryItemCreate, PantryItemResponse, PantryItemUpdate, RecipeDetail, RecipeIngredientResponse, RecipeSummary,
#     Recommendation, RecommendationRequest, RecommendationResponse, RegisterRequest, TokenResponse, UserResponse,
# )
# from app.services.calories import calculate_meal
# from app.services.security import create_access_token, current_user, hash_password, verify_password

# router = APIRouter(prefix="/api/v1")


# def _recipe_summary(recipe: Recipe) -> RecipeSummary:
#     return RecipeSummary(id=recipe.id, title=recipe.title, image_url=recipe.image_url, source_url=recipe.source_url)


# @router.post("/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
# def register(payload: RegisterRequest, db: Session = Depends(get_db)):
#     if db.scalar(select(User).where(User.email == payload.email)):
#         raise HTTPException(status_code=409, detail="An account with this email already exists")
#     user = User(email=str(payload.email).lower(), display_name=payload.display_name.strip(), password_hash=hash_password(payload.password))
#     db.add(user)
#     db.commit()
#     db.refresh(user)
#     return TokenResponse(access_token=create_access_token(user.id))


# @router.post("/auth/login", response_model=TokenResponse)
# def login(payload: LoginRequest, db: Session = Depends(get_db)):
#     user = db.scalar(select(User).where(User.email == str(payload.email).lower()))
#     if not user or not verify_password(payload.password, user.password_hash):
#         raise HTTPException(status_code=401, detail="Incorrect email or password")
#     return TokenResponse(access_token=create_access_token(user.id))


# @router.get("/users/me", response_model=UserResponse)
# def get_me(user: User = Depends(current_user)):
#     return user


# @router.get("/ingredients", response_model=list[IngredientResponse])
# def list_ingredients(search: str | None = None, limit: int = Query(30, ge=1, le=100), db: Session = Depends(get_db)):
#     query = select(Ingredient).order_by(Ingredient.name).limit(limit)
#     if search:
#         query = query.where(Ingredient.name.ilike(f"%{search.strip()}%"))
#     return db.scalars(query).all()


# @router.get("/ingredients/{ingredient_id}", response_model=IngredientResponse)
# def get_ingredient(ingredient_id: int, db: Session = Depends(get_db)):
#     ingredient = db.get(Ingredient, ingredient_id)
#     if not ingredient:
#         raise HTTPException(status_code=404, detail="Ingredient not found")
#     return ingredient


# @router.get("/recipes", response_model=list[RecipeSummary])
# def list_recipes(search: str | None = None, limit: int = Query(30, ge=1, le=100), offset: int = Query(0, ge=0), db: Session = Depends(get_db)):
#     query = select(Recipe).order_by(Recipe.title).offset(offset).limit(limit)
#     if search:
#         query = query.where(Recipe.title.ilike(f"%{search.strip()}%"))
#     return [_recipe_summary(recipe) for recipe in db.scalars(query).all()]


# @router.get("/recipes/{recipe_id}", response_model=RecipeDetail)
# def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
#     recipe = db.scalar(select(Recipe).where(Recipe.id == recipe_id).options(selectinload(Recipe.ingredients)))
#     if not recipe:
#         raise HTTPException(status_code=404, detail="Recipe not found")
#     return RecipeDetail(
#         **_recipe_summary(recipe).model_dump(), servings=recipe.servings,
#         ingredients=[RecipeIngredientResponse(ingredient_name=item.ingredient_name, quantity=item.quantity, unit=item.unit) for item in recipe.ingredients],
#     )


# @router.get("/pantry", response_model=list[PantryItemResponse])
# def list_pantry(user: User = Depends(current_user), db: Session = Depends(get_db)):
#     items = db.scalars(select(PantryItem).where(PantryItem.user_id == user.id).options(selectinload(PantryItem.ingredient))).all()
#     return [PantryItemResponse(id=item.id, ingredient_id=item.ingredient_id, name=item.ingredient.name, quantity=item.quantity, unit=item.unit) for item in items]


# @router.post("/pantry", response_model=PantryItemResponse, status_code=status.HTTP_201_CREATED)
# def add_pantry_item(payload: PantryItemCreate, user: User = Depends(current_user), db: Session = Depends(get_db)):
#     ingredient = db.get(Ingredient, payload.ingredient_id)
#     if not ingredient:
#         raise HTTPException(status_code=404, detail="Ingredient not found")
#     item = db.scalar(select(PantryItem).where(PantryItem.user_id == user.id, PantryItem.ingredient_id == payload.ingredient_id))
#     if item:
#         item.quantity, item.unit = payload.quantity, payload.unit
#     else:
#         item = PantryItem(user_id=user.id, ingredient_id=payload.ingredient_id, quantity=payload.quantity, unit=payload.unit)
#         db.add(item)
#     db.commit()
#     db.refresh(item)
#     return PantryItemResponse(id=item.id, ingredient_id=item.ingredient_id, name=ingredient.name, quantity=item.quantity, unit=item.unit)


# @router.patch("/pantry/{item_id}", response_model=PantryItemResponse)
# def update_pantry_item(item_id: int, payload: PantryItemUpdate, user: User = Depends(current_user), db: Session = Depends(get_db)):
#     item = db.scalar(select(PantryItem).where(PantryItem.id == item_id, PantryItem.user_id == user.id).options(selectinload(PantryItem.ingredient)))
#     if not item:
#         raise HTTPException(status_code=404, detail="Pantry item not found")
#     item.quantity, item.unit = payload.quantity, payload.unit
#     db.commit()
#     return PantryItemResponse(id=item.id, ingredient_id=item.ingredient_id, name=item.ingredient.name, quantity=item.quantity, unit=item.unit)


# @router.delete("/pantry/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete_pantry_item(item_id: int, user: User = Depends(current_user), db: Session = Depends(get_db)):
#     item = db.scalar(select(PantryItem).where(PantryItem.id == item_id, PantryItem.user_id == user.id))
#     if not item:
#         raise HTTPException(status_code=404, detail="Pantry item not found")
#     db.delete(item)
#     db.commit()


# @router.post("/meals/calculate")
# def calculate(payload: MealCalculationRequest, db: Session = Depends(get_db)):
#     return calculate_meal(db, payload)


# @router.post("/meals", response_model=MealResponse, status_code=status.HTTP_201_CREATED)
# def save_meal(payload: MealCreate, user: User = Depends(current_user), db: Session = Depends(get_db)):
#     calculated = calculate_meal(db, payload)
#     meal = Meal(user_id=user.id, meal_type=payload.meal_type, eaten_on=payload.eaten_on, total_calories=calculated.total_calories)
#     db.add(meal)
#     db.flush()
#     for input_item, computed in zip(payload.items, calculated.items):
#         db.add(MealItem(meal_id=meal.id, ingredient_id=input_item.ingredient_id, quantity=input_item.quantity, unit=input_item.unit, calories=computed.calories))
#     db.commit()
#     return MealResponse(id=meal.id, meal_type=meal.meal_type, eaten_on=meal.eaten_on, total_calories=meal.total_calories, items=calculated.items)


# @router.get("/meals/today", response_model=list[MealResponse])
# def today_meals(user: User = Depends(current_user), db: Session = Depends(get_db)):
#     meals = db.scalars(select(Meal).where(Meal.user_id == user.id, Meal.eaten_on == date.today()).options(selectinload(Meal.items).selectinload(MealItem.ingredient))).all()
#     return [MealResponse(id=meal.id, meal_type=meal.meal_type, eaten_on=meal.eaten_on, total_calories=meal.total_calories, items=[{"ingredient_id": item.ingredient_id, "name": item.ingredient.name, "calories": item.calories} for item in meal.items]) for meal in meals]


# ACTIVITY_FACTORS = {"sedentary": 1.2, "light": 1.375, "moderate": 1.55, "active": 1.725, "very_active": 1.9}
# MEAL_SPLITS = {"breakfast": 0.25, "lunch": 0.35, "dinner": 0.30, "snack": 0.10}


# def _goal_response(goal: UserGoal) -> GoalResponse:
#     if goal.daily_calorie_target is None:
#         return GoalResponse(**{field: getattr(goal, field) for field in GoalUpsert.model_fields}, daily_calorie_target=None, meals=None,
#                             guidance="For ages under 18, the app does not generate weight-change calorie targets. Please consult a qualified adult or health professional.")
#     return GoalResponse(**{field: getattr(goal, field) for field in GoalUpsert.model_fields}, daily_calorie_target=goal.daily_calorie_target,
#                         meals={name: round(goal.daily_calorie_target * share) for name, share in MEAL_SPLITS.items()})


# @router.put("/goals", response_model=GoalResponse)
# def upsert_goal(payload: GoalUpsert, user: User = Depends(current_user), db: Session = Depends(get_db)):
#     goal = db.scalar(select(UserGoal).where(UserGoal.user_id == user.id))
#     if not goal:
#         goal = UserGoal(user_id=user.id, **payload.model_dump(), daily_calorie_target=None)
#         db.add(goal)
#     else:
#         for field, value in payload.model_dump().items():
#             setattr(goal, field, value)

#     # A conservative estimate used for meal allocation, not medical advice.
#     if payload.age < 18:
#         goal.daily_calorie_target = None
#     else:
#         bmr = 10 * payload.current_weight_kg + 6.25 * payload.height_cm - 5 * payload.age - 78
#         maintenance = bmr * ACTIVITY_FACTORS[payload.activity_level]
#         adjustment = 0 if payload.target_type == "maintain" else (250 if payload.target_weight_kg > payload.current_weight_kg else -250)
#         goal.daily_calorie_target = max(1200, round(maintenance + adjustment))
#     db.commit()
#     db.refresh(goal)
#     return _goal_response(goal)


# @router.get("/goals", response_model=GoalResponse)
# def get_goal(user: User = Depends(current_user), db: Session = Depends(get_db)):
#     goal = db.scalar(select(UserGoal).where(UserGoal.user_id == user.id))
#     if not goal:
#         raise HTTPException(status_code=404, detail="No goal has been set")
#     return _goal_response(goal)


# @router.post("/recommendations", response_model=RecommendationResponse)
# def recommend(payload: RecommendationRequest, user: User = Depends(current_user), db: Session = Depends(get_db)):
#     """MVP deterministic ranking. AI can later explain/rerank these catalog IDs safely."""
#     pantry = db.scalars(select(PantryItem).where(PantryItem.user_id == user.id).options(selectinload(PantryItem.ingredient))).all()
#     if payload.use_pantry and not pantry:
#         raise HTTPException(status_code=400, detail="Your pantry is empty. Add ingredients before requesting pantry-based suggestions.")
#     pantry_names = [item.ingredient.name.casefold() for item in pantry]
#     pantry_tokens = {name: set(re.findall(r"[\w]+", name)) for name in pantry_names}
#     candidates = db.scalars(select(Recipe).options(selectinload(Recipe.ingredients))).all()
#     ranked: list[tuple[int, Recipe, list[str]]] = []
#     for recipe in candidates:
#         matches = []
#         for recipe_item in recipe.ingredients:
#             text = recipe_item.ingredient_name.casefold()
#             item_tokens = set(re.findall(r"[\w]+", text))
#             matches.extend(name for name in pantry_names if name in text or text in name or pantry_tokens[name].intersection(item_tokens))
#         if matches or not payload.use_pantry:
#             ranked.append((len(set(matches)), recipe, sorted(set(matches))))
#     ranked.sort(key=lambda value: (-value[0], value[1].title.casefold()))
#     if payload.use_pantry and not ranked:
#         # Scraped sources mix Vietnamese and English names. A useful fallback is better
#         # than an empty screen while a future embedding layer solves that language gap.
#         ranked = [(0, recipe, []) for recipe in candidates]
#     return RecommendationResponse(recommendations=[
#         Recommendation(
#             recipe_id=recipe.id, title=recipe.title, image_url=recipe.image_url, source_url=recipe.source_url,
#             matched_ingredients=matches, match_count=count,
#             reason=(f"Uses {count} ingredient{'s' if count != 1 else ''} currently in your pantry." if count else "A catalog option; no exact pantry-name match was found.") if payload.use_pantry else "Catalog recipe available to explore.",
#         ) for count, recipe, matches in ranked[:10]
#     ])
