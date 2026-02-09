from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..models import User, Transaction, Meal, Dish
import datetime
from .. import db
from ..utils import role_required

bp = Blueprint('logic', __name__)


@bp.route('/meals', methods=['POST', 'GET'])
@jwt_required()
@role_required(['admin'])
def add_meal():
    if request.method == 'POST':
        data = request.get_json()
        if Meal.query.filter_by(day_of_week=data["day_of_week"], type=data["type"]).first():
            return jsonify({"error": "Meal already exists"}), 400
        dish_ids = data['dishes']
        dishes = Dish.query.filter(Dish.id.in_(dish_ids)).all()
        if len(dishes) != len(dish_ids):
            found_ids = {d.id for d in dishes}
            missing = [did for did in dish_ids if did not in found_ids]
            return jsonify({"error": f"Dish IDs not found: {missing}"}), 404
        if not data['day_of_week'].lower() in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']:
            return jsonify({"error": "Invalid day of week"}), 400
        if not data['type'].lower() in ['breakfast', 'lunch']:
            return jsonify({"error": "Invalid type"}), 400
        meal = Meal(
            name=data['name'],
            price=int(data['price']),
            day_of_week=data['day_of_week'].lower(),
            type=data['type']
        )
        meal.dishes = dishes

        db.session.add(meal)
        db.session.commit()

        return jsonify(meal.to_dict()), 200
    if request.method == 'GET':
        meals = Meal.query.all()
        return jsonify({"meals": [meal.to_dict() for meal in meals]})

@bp.route('/meals_by_day', methods=['GET'])
@jwt_required()
@role_required(['admin', 'cook'])
def meals_by_day():
    day = request.args.get('day_of_week').lower()

    meals = Meal.query.filter(Meal.day_of_week == day).all()
    return jsonify({"meals": [meal.to_dict() for meal in meals]}), 200


@bp.route('/meals/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
@role_required(['admin'])
def meal_detail(id):
    meal = Meal.query.get_or_404(id)

    if request.method == 'GET':
        return jsonify(meal.to_dict()), 200
    elif request.method == 'PUT':
        data = request.get_json()
        allowed_keys = ["name", "price", "day_of_week", "dishes", "type"]

        if not all(key in allowed_keys for key in data.keys()):
            return jsonify({"error": "Invalid data fields"}), 400

        for key, value in data.items():
            if key == "dishes":
                if not isinstance(value, list):
                    return jsonify({"error": "'dishes' must be a list of IDs"}), 400
                try:
                    dish_ids = [int(i) for i in value]
                except (TypeError, ValueError):
                    return jsonify({"error": "All dish IDs must be integers"}), 400

                dishes = Dish.query.filter(Dish.id.in_(dish_ids)).all()

                if len(dishes) != len(dish_ids):
                    found_ids = {d.id for d in dishes}
                    missing = set(dish_ids) - found_ids
                    return jsonify({"error": f"Dish IDs not found: {sorted(missing)}"}), 404

                meal.dishes = dishes
            else:
                setattr(meal, key, value)

        db.session.commit()
        return jsonify({"message": "Meal updated"}), 200
    elif request.method == 'DELETE':
        try:
            db.session.delete(meal)
            db.session.commit()
            return jsonify({"message": "Meal deleted successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Failed to delete meal"}), 500
    return None


