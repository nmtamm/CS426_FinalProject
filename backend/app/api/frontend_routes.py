import math
import re
import unicodedata

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.db.database import get_db
from app.models.model import Ingredient, Recipe, User
from app.schemas.frontend_contracts import (
    FrontendAuthRequest,
    FrontendAuthResponse,
    FrontendIngredient,
    FrontendRecipe,
    FrontendUser,
    IngredientIdsRequest,
    IngredientPage,
    RecipePage,
)
from app.services.security import (
    create_access_token,
    hash_password,
    verify_password,
    current_user,
)

router = APIRouter(prefix="/api")

INGREDIENT_CATEGORIES = [
    "Tất cả",
    "Rau củ",
    "Thịt & Gia cầm",
    "Hải sản",
    "Trứng & Sữa",
    "Mì & Ngũ cốc",
    "Gia vị & Nêm",
    "Trái cây",
    "Bánh mì & Bánh ngọt",
    "Dầu ăn & Nước sốt",
    "Đồ hộp",
    "Các loại hạt",
]
RECIPE_CATEGORIES = [
    "Tất cả",
    "Cơm & Mì",
    "Canh & Súp",
    "Thịt",
    "Hải sản",
    "Rau",
    "Bánh & Bánh mì",
    "Tráng miệng",
    "Đồ uống",
    "Đồ ăn vặt",
]
TOKEN_ALIASES = {
    "chicken": {"ga"},
    "beef": {"bo"},
    "pork": {"heo", "lon"},
    "egg": {"trung"},
    "rice": {"gao", "com"},
    "fish": {"ca"},
    "shrimp": {"tom"},
    "garlic": {"toi"},
    "onion": {"hanh"},
    "tomato": {"ca", "chua"},
    "carrot": {"ca", "rot"},
    "mushroom": {"nam"},
    "potato": {"khoai", "tay"},
    "cheese": {"pho", "mai"},
}


def _frontend_user(user: User) -> FrontendUser:
    return FrontendUser(id=f"user-{user.id}", username=user.display_name)


@router.get("/users/me", response_model=FrontendUser)
def frontend_me(current_user: User = Depends(get_db)):
    return _frontend_user(current_user)


# def _ingredient_item(ingredient: Ingredient) -> FrontendIngredient:
#     return FrontendIngredient(
#         id=f"ing-{ingredient.id}", name=ingredient.name, category=ingredient.category,
#         image=ingredient.image_url, calories=ingredient.calories_per_100g,
#     )


# def _recipe_item(recipe: Recipe) -> FrontendRecipe:
#     return FrontendRecipe(
#         id=f"recipe-{recipe.id}", title=recipe.title, category=recipe.category,
#         image=recipe.image_url,
#         ingredients=[item.ingredient_name for item in recipe.ingredients if not item.is_seasoning],
#         seasoning=[item.ingredient_name for item in recipe.ingredients if item.is_seasoning],
#         instructionLink=recipe.source_url or "",
#     )


# def _page(total: int, page: int, limit: int) -> tuple[int, int]:
#     total_pages = max(1, math.ceil(total / limit))
#     return total_pages, (page - 1) * limit


# def _numeric_id(value: str, prefix: str) -> int:
#     match = re.fullmatch(rf"{re.escape(prefix)}-(\d+)", value)
#     if not match:
#         raise HTTPException(status_code=422, detail=f"Invalid {prefix} ID: {value}")
#     return int(match.group(1))


def _tokens(value: str) -> set[str]:
    normalized = unicodedata.normalize("NFD", value.casefold())
    ascii_text = "".join(
        character for character in normalized if unicodedata.category(character) != "Mn"
    )
    result = set(re.findall(r"[a-z0-9]+", ascii_text))
    for token in tuple(result):
        result.update(TOKEN_ALIASES.get(token, set()))
    return result


@router.post(
    "/auth/register",
    response_model=FrontendAuthResponse,
    status_code=status.HTTP_201_CREATED,
)
def frontend_register(payload: FrontendAuthRequest, db: Session = Depends(get_db)):
    username = payload.username.strip()
    lookup = username.casefold()
    if db.scalar(select(User).where(User.email == lookup)):
        raise HTTPException(status_code=409, detail="Tên đăng nhập đã tồn tại")
    user = User(
        email=lookup,
        display_name=username,
        password_hash=hash_password(payload.password),
        full_name=payload.full_name.strip() if payload.full_name else username.strip(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return FrontendAuthResponse(
        token=create_access_token(user.id), user=_frontend_user(user)
    )


@router.post("/auth/login", response_model=FrontendAuthResponse)
def frontend_login(payload: FrontendAuthRequest, db: Session = Depends(get_db)):
    user = db.scalar(
        select(User).where(User.email == payload.username.strip().casefold())
    )
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=401, detail="Tên đăng nhập hoặc mật khẩu không đúng"
        )
    return FrontendAuthResponse(
        token=create_access_token(user.id), user=_frontend_user(user)
    )


@router.put("/users/me/")
def updateFullName(
    fullName: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(current_user),
):
    user = db.scalar(select(User).where(User.id == current_user.id))
    if not user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại")
    user.full_name = fullName.strip()
    db.commit()
    db.refresh(user)
    return {"message": "Cập nhật tên đầy đủ thành công", "full_name": user.full_name}


@router.put("/users/me/password")
def updatePassword(
    password: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(current_user),
):
    user = db.scalar(select(User).where(User.id == current_user.id))
    if not user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại")
    user.password_hash = hash_password(password)
    db.commit()
    db.refresh(user)
    return {"message": "Cập nhật mật khẩu thành công"}


# @router.get("/ingredients/categories", response_model=list[str])
# def ingredient_categories():
#     return INGREDIENT_CATEGORIES


# @router.get("/ingredients", response_model=IngredientPage)
# def frontend_ingredients(
#     search: str = "", category: str = "Tất cả", page: int = Query(1, ge=1),
#     limit: int = Query(10, ge=1, le=100), db: Session = Depends(get_db),
# ):
#     filters = []
#     if category and category != "Tất cả":
#         filters.append(Ingredient.category == category)
#     search_text = search.strip().casefold()
#     if search_text:
#         candidates = db.scalars(select(Ingredient).where(*filters).order_by(Ingredient.name)).all()
#         matching = [item for item in candidates if search_text in item.name.casefold()]
#         total = len(matching)
#         total_pages, offset = _page(total, page, limit)
#         ingredients = matching[offset:offset + limit]
#     else:
#         total = db.scalar(select(func.count(Ingredient.id)).where(*filters)) or 0
#         total_pages, offset = _page(total, page, limit)
#         ingredients = db.scalars(
#             select(Ingredient).where(*filters).order_by(Ingredient.name).offset(offset).limit(limit)
#         ).all()
#     return IngredientPage(
#         items=[_ingredient_item(item) for item in ingredients], page=page, limit=limit,
#         total=total, totalPages=total_pages,
#     )


# @router.get("/recipes/categories", response_model=list[str])
# def recipe_categories():
#     return RECIPE_CATEGORIES


# @router.get("/recipes", response_model=RecipePage)
# def frontend_recipes(
#     search: str = "", category: str = "Tất cả", page: int = Query(1, ge=1),
#     limit: int = Query(10, ge=1, le=100), db: Session = Depends(get_db),
# ):
#     filters = []
#     if category and category != "Tất cả":
#         filters.append(Recipe.category == category)
#     search_text = search.strip().casefold()
#     if search_text:
#         candidates = db.scalars(select(Recipe).where(*filters).order_by(Recipe.title)).all()
#         matching_ids = [item.id for item in candidates if search_text in item.title.casefold()]
#         total = len(matching_ids)
#         total_pages, offset = _page(total, page, limit)
#         page_ids = matching_ids[offset:offset + limit]
#         loaded = db.scalars(
#             select(Recipe).where(Recipe.id.in_(page_ids)).options(selectinload(Recipe.ingredients))
#         ).all()
#         by_id = {recipe.id: recipe for recipe in loaded}
#         recipes = [by_id[recipe_id] for recipe_id in page_ids]
#     else:
#         total = db.scalar(select(func.count(Recipe.id)).where(*filters)) or 0
#         total_pages, offset = _page(total, page, limit)
#         recipes = db.scalars(
#             select(Recipe).where(*filters).options(selectinload(Recipe.ingredients))
#             .order_by(Recipe.title).offset(offset).limit(limit)
#         ).all()
#     return RecipePage(
#         items=[_recipe_item(item) for item in recipes], page=page, limit=limit,
#         total=total, totalPages=total_pages,
#     )


# @router.post("/recipes/search-by-ingredients", response_model=RecipePage)
# def search_recipes_by_ingredients(
#     payload: IngredientIdsRequest, page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100),
#     search: str = "", category: str = "Tất cả", db: Session = Depends(get_db),
# ):
#     ingredient_ids = [_numeric_id(value, "ing") for value in payload.ingredientIds]
#     ingredients = db.scalars(select(Ingredient).where(Ingredient.id.in_(ingredient_ids))).all()
#     if len(ingredients) != len(set(ingredient_ids)):
#         raise HTTPException(status_code=404, detail="Không tìm thấy một hoặc nhiều nguyên liệu")
#     selected_tokens = [_tokens(ingredient.name) for ingredient in ingredients]
#     candidates = db.scalars(
#         select(Recipe).options(selectinload(Recipe.ingredients)).order_by(Recipe.title)
#     ).all()
#     ranked = []
#     for recipe in candidates:
#         if search.strip() and search.strip().casefold() not in recipe.title.casefold():
#             continue
#         if category != "Tất cả" and recipe.category != category:
#             continue
#         recipe_tokens = set().union(*(_tokens(item.ingredient_name) for item in recipe.ingredients))
#         match_count = sum(bool(tokens.intersection(recipe_tokens)) for tokens in selected_tokens)
#         if match_count:
#             ranked.append((match_count, recipe))
#     ranked.sort(key=lambda item: (-item[0], item[1].title.casefold()))
#     total = len(ranked)
#     total_pages, offset = _page(total, page, limit)
#     recipes = [recipe for _, recipe in ranked[offset:offset + limit]]
#     return RecipePage(
#         items=[_recipe_item(item) for item in recipes], page=page, limit=limit,
#         total=total, totalPages=total_pages,
#     )
