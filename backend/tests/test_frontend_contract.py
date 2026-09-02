from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.database import Base, get_db
from app.main import app
from app.models import Ingredient, Recipe, RecipeIngredient


@pytest.fixture()
def client() -> Generator[TestClient, None, None]:
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    testing_session = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    Base.metadata.create_all(engine)
    with testing_session() as db:
        chicken = Ingredient(
            name="Chicken", category="Thịt & Gia cầm", calories_per_100g=165,
            default_quantity=100, default_unit="g", image_url="https://example.com/chicken.jpg",
        )
        broccoli = Ingredient(
            name="Broccoli", category="Rau củ", calories_per_100g=34,
            default_quantity=100, default_unit="g", image_url=None,
        )
        recipe = Recipe(
            title="Cơm gà", category="Cơm & Mì", source_key="test:1",
            source_url="https://example.com/recipe", image_url=None,
        )
        recipe.ingredients = [
            RecipeIngredient(ingredient_name="Thịt gà", quantity=200, unit="g", is_seasoning=False),
            RecipeIngredient(ingredient_name="Tiêu", quantity=2, unit="g", is_seasoning=True),
        ]
        db.add_all([chicken, broccoli, recipe])
        db.commit()

    def override_db():
        with testing_session() as db:
            yield db

    app.dependency_overrides[get_db] = override_db
    yield TestClient(app)
    app.dependency_overrides.clear()
    Base.metadata.drop_all(engine)


def test_auth_contract(client: TestClient):
    credentials = {"username": "mobile_user", "password": "secret123"}
    registered = client.post("/api/auth/register", json=credentials)
    assert registered.status_code == 201
    assert set(registered.json()) == {"token", "user"}
    assert registered.json()["user"]["username"] == "mobile_user"

    logged_in = client.post("/api/auth/login", json=credentials)
    assert logged_in.status_code == 200
    assert logged_in.json()["token"]


def test_ingredient_contract_and_pagination(client: TestClient):
    categories = client.get("/api/ingredients/categories")
    assert categories.status_code == 200
    assert categories.json()[0] == "Tất cả"

    response = client.get(
        "/api/ingredients", params={"category": "Thịt & Gia cầm", "page": 1, "limit": 1}
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["total"] == 1
    assert payload["totalPages"] == 1
    assert payload["items"] == [{
        "id": "ing-1", "name": "Chicken", "category": "Thịt & Gia cầm",
        "image": "https://example.com/chicken.jpg", "calories": 165.0,
    }]


def test_recipe_contract_and_ingredient_search(client: TestClient):
    recipes = client.get("/api/recipes", params={"search": "CƠM", "page": 1, "limit": 10})
    assert recipes.status_code == 200
    item = recipes.json()["items"][0]
    assert item["id"] == "recipe-1"
    assert item["ingredients"] == ["Thịt gà"]
    assert item["seasoning"] == ["Tiêu"]

    matched = client.post(
        "/api/recipes/search-by-ingredients?page=1&limit=10",
        json={"ingredientIds": ["ing-1"]},
    )
    assert matched.status_code == 200
    assert matched.json()["total"] == 1
    assert matched.json()["items"][0]["title"] == "Cơm gà"
