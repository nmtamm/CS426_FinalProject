from datetime import date

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class Message(BaseModel):
    message: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    display_name: str = Field(min_length=1, max_length=80)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: EmailStr
    display_name: str


class IngredientResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    calories_per_100g: float
    default_quantity: float
    default_unit: str
    image_url: str | None


class RecipeIngredientResponse(BaseModel):
    ingredient_name: str
    quantity: float | None
    unit: str | None


class RecipeSummary(BaseModel):
    id: int
    title: str
    image_url: str | None
    source_url: str | None
    estimated_calories: float | None = None


class RecipeDetail(RecipeSummary):
    servings: int
    ingredients: list[RecipeIngredientResponse]


class PantryItemCreate(BaseModel):
    ingredient_id: int
    quantity: float = Field(gt=0, le=100000)
    unit: str = Field(min_length=1, max_length=30)


class PantryItemUpdate(BaseModel):
    quantity: float = Field(gt=0, le=100000)
    unit: str = Field(min_length=1, max_length=30)


class PantryItemResponse(BaseModel):
    id: int
    ingredient_id: int
    name: str
    quantity: float
    unit: str


class CalorieItem(BaseModel):
    ingredient_id: int
    quantity: float = Field(gt=0, le=100000)
    unit: str = Field(min_length=1, max_length=30)


class MealCalculationRequest(BaseModel):
    items: list[CalorieItem] = Field(min_length=1, max_length=100)


class CalculatedItem(BaseModel):
    ingredient_id: int
    name: str
    calories: float


class MealCalculationResponse(BaseModel):
    total_calories: float
    items: list[CalculatedItem]


class MealCreate(MealCalculationRequest):
    meal_type: str = Field(pattern="^(breakfast|lunch|dinner|snack)$")
    eaten_on: date = Field(default_factory=date.today)


class MealResponse(BaseModel):
    id: int
    meal_type: str
    eaten_on: date
    total_calories: float
    items: list[CalculatedItem]


class GoalUpsert(BaseModel):
    current_weight_kg: float = Field(ge=20, le=400)
    target_weight_kg: float = Field(ge=20, le=400)
    height_cm: float = Field(ge=80, le=250)
    age: int = Field(ge=13, le=120)
    activity_level: str = Field(pattern="^(sedentary|light|moderate|active|very_active)$")
    target_type: str = Field(pattern="^(maintain|gradual_change)$")

    @field_validator("target_weight_kg")
    @classmethod
    def reasonable_target(cls, value: float) -> float:
        return value


class GoalResponse(GoalUpsert):
    daily_calorie_target: int | None
    meals: dict[str, int] | None
    guidance: str | None = None


class RecommendationRequest(BaseModel):
    meal_type: str = Field(pattern="^(breakfast|lunch|dinner|snack)$")
    target_calories: int | None = Field(default=None, ge=100, le=3000)
    use_pantry: bool = True


class Recommendation(BaseModel):
    recipe_id: int
    title: str
    image_url: str | None
    source_url: str | None
    matched_ingredients: list[str]
    match_count: int
    reason: str


class RecommendationResponse(BaseModel):
    recommendations: list[Recommendation]
    generated_by: str = "deterministic_catalog_ranking"
