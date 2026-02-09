from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON, Float, Boolean
from sqlalchemy.orm import relationship
from .extensions import db
import datetime
from werkzeug.security import generate_password_hash, check_password_hash

Base = db.Model


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(80), unique=True, nullable=False)
    name = Column(String(80), nullable=False)
    surname = Column(String(80), nullable=False)
    patronymic = Column(String(80), nullable=False)
    balance = Column(Float, nullable=False, default=0)
    email = Column(String(120), unique=True, nullable=False)
    role = Column(String(20), nullable=False, default='student')
    password_hash = Column(String(200), nullable=False)

    allergies = relationship("Ingredient", secondary="user_allergies", back_populates="allergic_users")
    transactions = relationship("Transaction", back_populates="user")
    orders = relationship("Order", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    purchase_requests = relationship("PurchaseRequest", back_populates="user")


    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "name": self.name,
            "surname": self.surname,
            "patronymic": self.patronymic,
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
    created_at = Column(DateTime, nullable=False, default=datetime.datetime.now())

    dish_ingredients = relationship("DishIngredient", back_populates="dish")
    meals = relationship("Meal", secondary="meal_ingredients", back_populates="dishes"
                        )
    reviews = relationship("Review", back_populates="dish")

    def to_dict(self, include_ingredients=False):
        sl = []
        if include_ingredients:
            for ingredient in self.dish_ingredients:
                ingr = Ingredient.query.get(ingredient.ingredient_id)
                sl.append(ingr.to_dict())
            return {
                "id": self.id,
                "name": self.name,
                "weight": self.weight,
                "ingredients": sl
            }

        return {
            "id": self.id,
            "name": self.name,
            "weight": self.weight,
        }


class Ingredient(Base):
    __tablename__ = 'ingredients'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(80), nullable=False)
    quantity = Column(Integer)


    dish_ingredients = relationship('DishIngredient', back_populates='ingredient', cascade='all, delete-orphan')
    allergic_users = relationship("User", secondary="user_allergies", back_populates="allergies")
    purchase_requests = relationship("PurchaseRequest", back_populates="ingredient")

    def __repr__(self):
        return f'Ingredient {self.name}'

    def to_dict(self, include_dishes=False):
        sl = []
        if include_dishes:
            for dish in self.dish_ingredients:
                dish = Dish.query.get(dish.dish_id)
                sl.append(dish.to_dict())
            return {'id': self.id, 'name': self.name, 'quantity': self.quantity, 'dishes': sl}
        return {'id': self.id, 'quantity': self.quantity, 'name': self.name}


class DishIngredient(Base):
    __tablename__ = 'dish_ingredient'
    dish_id = Column(Integer, ForeignKey('dishes.id'), primary_key=True)
    ingredient_id = Column(Integer, ForeignKey('ingredients.id'), primary_key=True)

    dish = relationship("Dish", back_populates='dish_ingredients')
    ingredient = relationship('Ingredient', back_populates='dish_ingredients')


class Transaction(Base):
    __tablename__ = 'transactions'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(String(200), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.datetime.now())

    user = relationship("User", back_populates="transactions")


class UserAllergies(Base):
    __tablename__ = 'user_allergies'

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), primary_key=True)


class Meal(Base):
    __tablename__ = 'meals'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(80), nullable=False)
    price = Column(Float, nullable=False)
    day_of_week = Column(String)
    quantity = Column(Integer)
    type = Column(String(20), nullable=False)

    dishes = relationship("Dish", secondary="meal_ingredients", back_populates="meals")
    orders = relationship("Order", secondary='orders_meals', back_populates='meals')

    def to_dict(self):
        sl = []
        for dish in self.dishes:
            sl.append(dish.to_dict())
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "quantity": self.quantity,
            "day_of_week": self.day_of_week,
            "type": self.type,
            "dishes": sl
        }


class Order(Base):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="orders")
    meals = relationship("Meal", secondary='orders_meals', back_populates="orders")

    def to_dict(self):
        sl = [meal.to_dict() for meal in self.meals]
        return {
            "id": self.id,
            "user_id": self.user_id,
            "date": self.date,
            "meals": sl
        }

class Review(Base):
    __tablename__ = 'reviews'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    dish_id = Column(Integer, ForeignKey('dishes.id'), nullable=False)
    score = Column(Integer, nullable=False)
    comment = Column(String(200), nullable=False)

    user = relationship("User", back_populates="reviews")
    dish = relationship("Dish", back_populates="reviews")

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.user.username,
            "score": self.score,
            "comment": self.comment,
        }


class OrderMeal(Base):
    __tablename__ = 'orders_meals'

    order_id = Column(Integer, ForeignKey('orders.id'), primary_key=True)
    meal_id = Column(Integer, ForeignKey("meals.id"), primary_key=True)


class MealDish(Base):
    __tablename__ = 'meal_ingredients'

    meal_id = Column(Integer, ForeignKey('meals.id'), primary_key=True)
    dish_id = Column(Integer, ForeignKey('dishes.id'), primary_key=True)


class PurchaseRequest(Base):
    __tablename__ = 'purchase_requests'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    ingredient_id = Column(Integer, ForeignKey('ingredients.id'), nullable=False)
    quantity = Column(Integer, nullable=False)
    is_accepted = Column(Boolean)
    data=Column(DateTime, nullable=False, default=datetime.datetime.now())

    user = relationship("User", back_populates="purchase_requests")
    ingredient = relationship("Ingredient", back_populates="purchase_requests")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "ingredient_id": self.ingredient_id,
            "quantity": self.quantity,
            "is_accepted": self.is_accepted,
            "data": self.data
        }

class Subscription(Base):
    __tablename__ = 'subscriptions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    type = Column(String(20), nullable=False)
    duration = Column(Integer, nullable=False)

    user = relationship("User", back_populates="subscriptions")

    @property
    def active(self):
         return self.duration > 0