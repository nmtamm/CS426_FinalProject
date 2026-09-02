from pydantic import BaseModel, Field


class FrontendAuthRequest(BaseModel):
    username: str = Field(min_length=1, max_length=80)
    password: str = Field(min_length=6, max_length=128)


class FrontendUser(BaseModel):
    id: str
    username: str


class FrontendAuthResponse(BaseModel):
    token: str
    user: FrontendUser


class FrontendIngredient(BaseModel):
    id: str
    name: str
    category: str
    image: str | None
    calories: float


class FrontendRecipe(BaseModel):
    id: str
    title: str
    category: str
    image: str | None
    ingredients: list[str]
    seasoning: list[str]
    instructionLink: str


class IngredientIdsRequest(BaseModel):
    ingredientIds: list[str] = Field(min_length=1, max_length=100)


class IngredientPage(BaseModel):
    items: list[FrontendIngredient]
    page: int
    limit: int
    total: int
    totalPages: int


class RecipePage(BaseModel):
    items: list[FrontendRecipe]
    page: int
    limit: int
    total: int
    totalPages: int
