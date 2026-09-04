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
    calories: int
    default_quantity: int | None = None
    default_unit: Optional[str] = None
    image: Optional[str] = None
    categories: List[IngredientCategory]


class RecipeCategory(BaseModel):
    id: int
    name: str
    image: Optional[str] = None


class Recipe(BaseModel):
    id: int
    title: str
    instructions: str
    main_ingredients: List[Ingredient]
    supplements: List[Ingredient]
    image: Optional[str] = None
    categories: List[RecipeCategory]


class CustomRecipe(BaseModel):
    id: int
    title: str
    instructions: str
    ingredients: List[Ingredient]
    image: Optional[str] = None


class CustomRecipeCreate(BaseModel):
    title: str
    instructions: str
    ingredients: List[Dict[str, Any]]
    image: Optional[str] = None


class CustomRecipeUpdate(BaseModel):
    id: int
    title: Optional[str] = None
    instructions: Optional[str] = None
    ingredients: Optional[List[Dict[str, Any]]] = None
    image: Optional[str] = None


class IngredientSearchRequest(BaseModel):
    # Match your exact frontend key payload structure directly
    ingredientIds: list[int]

    @property
    def ingredient_ids(self) -> list[int]:
        return self.ingredientIds
