from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import Ingredient
from app.schemas.contracts import CalculatedItem, MealCalculationRequest, MealCalculationResponse


GRAM_UNITS = {"g", "gr", "gram", "grams"}


def calculate_meal(db: Session, request: MealCalculationRequest) -> MealCalculationResponse:
    """Calculate only gram-based foods; never delegate nutrition arithmetic to an LLM."""
    result: list[CalculatedItem] = []
    for item in request.items:
        if item.unit.strip().casefold() not in GRAM_UNITS:
            raise HTTPException(
                status_code=422,
                detail=f"{item.unit!r} is not supported for calorie calculation. Use grams (g).",
            )
        ingredient = db.get(Ingredient, item.ingredient_id)
        if not ingredient:
            raise HTTPException(status_code=404, detail=f"Ingredient {item.ingredient_id} was not found")
        calories = round(ingredient.calories_per_100g * item.quantity / 100, 1)
        result.append(CalculatedItem(ingredient_id=ingredient.id, name=ingredient.name, calories=calories))
    return MealCalculationResponse(total_calories=round(sum(item.calories for item in result), 1), items=result)
