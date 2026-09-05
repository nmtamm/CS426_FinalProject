# from __future__ import annotations

# from datetime import date, datetime

# from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Integer, String, UniqueConstraint, func
# from sqlalchemy.orm import Mapped, mapped_column, relationship

# from app.db.database import Base


# class User(Base):
#     __tablename__ = "users"

#     id: Mapped[int] = mapped_column(primary_key=True)
#     email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
#     display_name: Mapped[str] = mapped_column(String(80))
#     password_hash: Mapped[str] = mapped_column(String(255))
#     created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

#     pantry_items: Mapped[list[PantryItem]] = relationship(back_populates="user", cascade="all, delete-orphan")


# class Ingredient(Base):
#     __tablename__ = "ingredients"

#     id: Mapped[int] = mapped_column(primary_key=True)
#     name: Mapped[str] = mapped_column(String(255), unique=True, index=True)
#     category: Mapped[str] = mapped_column(String(80), default="Rau củ", index=True)
#     calories_per_100g: Mapped[float] = mapped_column(Float)
#     default_quantity: Mapped[float] = mapped_column(Float, default=100)
#     default_unit: Mapped[str] = mapped_column(String(30), default="g")
#     image_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)


# class Recipe(Base):
#     __tablename__ = "recipes"
#     __table_args__ = (UniqueConstraint("source_key", name="uq_recipe_source_key"),)

#     id: Mapped[int] = mapped_column(primary_key=True)
#     title: Mapped[str] = mapped_column(String(255), index=True)
#     category: Mapped[str] = mapped_column(String(80), default="Thịt", index=True)
#     source_key: Mapped[str] = mapped_column(String(512))
#     source_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
#     image_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
#     servings: Mapped[int] = mapped_column(Integer, default=1)
#     owner_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
#     created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

#     ingredients: Mapped[list[RecipeIngredient]] = relationship(back_populates="recipe", cascade="all, delete-orphan")


# class RecipeIngredient(Base):
#     __tablename__ = "recipe_ingredients"

#     id: Mapped[int] = mapped_column(primary_key=True)
#     recipe_id: Mapped[int] = mapped_column(ForeignKey("recipes.id"), index=True)
#     ingredient_name: Mapped[str] = mapped_column(String(255), index=True)
#     quantity: Mapped[float | None] = mapped_column(Float, nullable=True)
#     unit: Mapped[str | None] = mapped_column(String(40), nullable=True)
#     is_seasoning: Mapped[bool] = mapped_column(Boolean, default=False)

#     recipe: Mapped[Recipe] = relationship(back_populates="ingredients")


# class PantryItem(Base):
#     __tablename__ = "pantry_items"
#     __table_args__ = (UniqueConstraint("user_id", "ingredient_id", name="uq_pantry_user_ingredient"),)

#     id: Mapped[int] = mapped_column(primary_key=True)
#     user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
#     ingredient_id: Mapped[int] = mapped_column(ForeignKey("ingredients.id"), index=True)
#     quantity: Mapped[float] = mapped_column(Float)
#     unit: Mapped[str] = mapped_column(String(30))

#     user: Mapped[User] = relationship(back_populates="pantry_items")
#     ingredient: Mapped[Ingredient] = relationship()


# class UserGoal(Base):
#     __tablename__ = "user_goals"

#     id: Mapped[int] = mapped_column(primary_key=True)
#     user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, index=True)
#     current_weight_kg: Mapped[float] = mapped_column(Float)
#     target_weight_kg: Mapped[float] = mapped_column(Float)
#     height_cm: Mapped[float] = mapped_column(Float)
#     age: Mapped[int] = mapped_column(Integer)
#     activity_level: Mapped[str] = mapped_column(String(30))
#     target_type: Mapped[str] = mapped_column(String(30))
#     daily_calorie_target: Mapped[int | None] = mapped_column(Integer, nullable=True)


# class Meal(Base):
#     __tablename__ = "meals"

#     id: Mapped[int] = mapped_column(primary_key=True)
#     user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
#     meal_type: Mapped[str] = mapped_column(String(20))
#     eaten_on: Mapped[date] = mapped_column(Date, default=date.today, index=True)
#     total_calories: Mapped[float] = mapped_column(Float)
#     created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
#     items: Mapped[list[MealItem]] = relationship(back_populates="meal", cascade="all, delete-orphan")


# class MealItem(Base):
#     __tablename__ = "meal_items"

#     id: Mapped[int] = mapped_column(primary_key=True)
#     meal_id: Mapped[int] = mapped_column(ForeignKey("meals.id"), index=True)
#     ingredient_id: Mapped[int] = mapped_column(ForeignKey("ingredients.id"))
#     quantity: Mapped[float] = mapped_column(Float)
#     unit: Mapped[str] = mapped_column(String(30))
#     calories: Mapped[float] = mapped_column(Float)

#     meal: Mapped[Meal] = relationship(back_populates="items")
#     ingredient: Mapped[Ingredient] = relationship()
