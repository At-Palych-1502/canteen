from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from .extensions import db
import datetime
from werkzeug.security import generate_password_hash, check_password_hash

Base = db.Model


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(80), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    role = Column(String(20), nullable=False, default='student')
    password_hash = Column(String(200), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role
        }

    def __repr__(self):
        return f"User('{self.username}', '{self.email}', '{self.role}')"


class Dish(Base):
    __tablename__ = 'dishes'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(80), nullable=False)
    weight = Column(Integer, nullable=False)
    meal = Column(String(20), nullable=False)
    quantity = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.datetime.now())

    dish_ingredients = relationship("DishIngredient", back_populates="dish")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "weight": self.weight,
            "quantity": self.quantity
        }

class Ingredient(Base):
    __tablename__ = 'ingredients'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(80), nullable=False)

    dish_ingredients = relationship('DishIngredient', back_populates='dish')


class DishIngredient(Base):
    __tablename__ = 'dish_ingredient'
    dish_id = Column(Integer, ForeignKey('dishes.id'), primary_key=True)
    ingredient_id = Column(Integer, ForeignKey('ingredients.id'), primary_key=True)

    dish = relationship("Dish", back_populates='dish_ingredients')
    ingredient = relationship('Ingredient', back_populates='dish_Ingredients')


