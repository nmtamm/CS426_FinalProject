from pydantic import BaseModel, field_serializer, Field
from typing import List, Optional, Any, Dict
from datetime import datetime, timezone


class IngredientCategory(BaseModel):
    id: int
    name: str
    image: Optional[str] = None


class Ingredient(BaseModel):
    id: int
    name: str
    calories: int | None = None
    default_quantity: int | None = None
    default_unit: Optional[str] = None
    image: Optional[str] = None
    categories: List[IngredientCategory]


class RecipeIngredient(BaseModel):
    id: int
    name: str
    quantity: Optional[float] = None
    unit: Optional[str] = None
    image: Optional[str] = None


class RecipeCategory(BaseModel):
    id: int
    name: str
    image: Optional[str] = None


class Recipe(BaseModel):
    id: int
    title: str
    instructions: str
    main_ingredients: List[RecipeIngredient]
    supplements: List[RecipeIngredient]
    image: Optional[str] = None
    categories: List[RecipeCategory]


class CustomRecipeIngredient(BaseModel):
    id: int
    name: str
    quantity: Optional[float] = None
    unit: Optional[str] = None
    default_quantity: Optional[float] = None
    default_unit: Optional[str] = None
    image: Optional[str] = None
    calories: Optional[int] = None


class CustomRecipe(BaseModel):
    id: int
    title: str
    instructions: str
    ingredients: List[CustomRecipeIngredient]
    image: Optional[str] = None


class IngredientResponse(BaseModel):
    id: int
    unit: Optional[str] = None
    quantity: Optional[float] = None


class CustomRecipeCreate(BaseModel):
    title: str
    instructions: str
    ingredients: List[IngredientResponse]
    image: Optional[str] = None


class CustomRecipeUpdate(BaseModel):
    id: int
    title: Optional[str] = None
    instructions: Optional[str] = None
    ingredients: List[IngredientResponse]
    image: Optional[str] = None


class IngredientSearchRequest(BaseModel):
    # Match your exact frontend key payload structure directly
    ingredientIds: list[int]

    @property
    def ingredient_ids(self) -> list[int]:
        return self.ingredientIds
