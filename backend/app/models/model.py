# models.py
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Float,
    DateTime,
    ForeignKey,
    Text,
    CheckConstraint,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

UserBase = declarative_base()


class User(UserBase):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(320), unique=True, index=True, nullable=False)
    display_name = Column(String(80), nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    full_name = Column(String(80), nullable=True)


class IngredientCategory(UserBase):
    __tablename__ = "ingredient_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), nullable=False)
    image = Column(String(255), nullable=True)


class Ingredient(UserBase):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), nullable=False)
    calories = Column(Integer, nullable=False)
    default_quantity = Column(Float, nullable=False)
    default_unit = Column(String(20), nullable=False)
    image = Column(String(255), nullable=True)
    is_main = Column(Boolean, default=False)


class RecipeCategory(UserBase):
    __tablename__ = "recipe_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), nullable=False)
    image = Column(String(255), nullable=True)


class Recipe(UserBase):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    instructions = Column(Text, nullable=False)
    image = Column(String(255), nullable=True)


class DishIngredient(UserBase):
    __tablename__ = "dish_ingredients"

    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String(20), nullable=False)

    recipe = relationship("Recipe", backref="recipe_ingredients")
    ingredient = relationship("Ingredient", backref="recipe_ingredients")


class CustomRecipe(UserBase):
    __tablename__ = "custom_recipes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    instructions = Column(Text, nullable=False)
    image = Column(String(255), nullable=True)

    user = relationship("User", backref="custom_recipes")


class CustomDishIngredient(UserBase):
    __tablename__ = "custom_dish_ingredients"

    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("custom_recipes.id"), nullable=False)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String(20), nullable=False)

    custom_recipe = relationship("CustomRecipe", backref="custom_recipe_ingredients")
    ingredient = relationship("Ingredient", backref="custom_recipe_ingredients")


class FavoriteRecipe(UserBase):
    __tablename__ = "favorite_recipes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)

    user = relationship("User", backref="favorite_recipes")
    recipe = relationship("Recipe", backref="favorited_by_users")


class IngredientCategoryMapping(UserBase):
    __tablename__ = "ingredient_categories_mapping"

    id = Column(Integer, primary_key=True, index=True)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), nullable=False)
    category_id = Column(
        Integer, ForeignKey("ingredient_categories.id"), nullable=False
    )

    ingredient = relationship("Ingredient", backref="category_mappings")
    category = relationship("IngredientCategory", backref="ingredient_mappings")


class RecipeCategoryMapping(UserBase):
    __tablename__ = "recipe_categories_mapping"

    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("recipe_categories.id"), nullable=False)

    recipe = relationship("Recipe", backref="category_mappings")
    category = relationship("RecipeCategory", backref="recipe_mappings")
