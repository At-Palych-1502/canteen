from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User, Transaction, Meal, Dish, Order
import datetime
from .. import db
from ..utils import role_required

bp = Blueprint('logic', __name__)


@bp.route('/meals', methods=['GET'])
@jwt_required()
def get_meals():
    meals = Meal.query.all()
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404
    user_allergy_ids = {ingr.id for ingr in user.allergies}

    sl = []
    for meal in meals:
        meal_data = meal.to_dict()
        allergies_found = []

        for dish in meal.dishes:
            for dish_ingr_rel in dish.dish_ingredients:
                ingredient_id = dish_ingr_rel.ingredient_id
                if ingredient_id in user_allergy_ids:
                    ingredient_obj = dish_ingr_rel.ingredient
                    allergies_found.append(ingredient_obj.to_dict())

        meal_data['allergies'] = allergies_found
        sl.append(meal_data)

    return jsonify({"meals": sl})

@bp.route('/meals', methods=['POST'])
@jwt_required()
@role_required(['admin'])
def add_meal():
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
        

@bp.route('/meals_by_day', methods=['GET'])
@jwt_required()
@role_required(['admin', 'cook'])
def meals_by_day():
    day = request.args.get('day_of_week').lower()

    meals = Meal.query.filter(Meal.day_of_week == day).all()
    sl = []
    for i in range(len(meals)):
        meal = meals[i]
        sl.append(meal.to_dict())

        orders = Order.query.filter_by(meal_id=meal.id, date=str(datetime.datetime.today().date()), is_given=True).all()
        given = len(orders)

        sl[i]["given"] = given
    return jsonify({"meals": sl}), 200


@bp.route('/meals/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
@role_required(['admin'])
def meal_detail(id):
    meal = Meal.query.get_or_404(id)

    if request.method == 'GET':
        return jsonify(meal.to_dict()), 200
    elif request.method == 'PUT':
        data = request.get_json()
        allowed_keys = ["name", "price", "day_of_week", "dishes", "type", "quantity"]

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
