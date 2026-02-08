from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..models import User, Transaction, Meal, Dish
import datetime
from .. import db
from ..utils import role_required

bp = Blueprint('logic', __name__)


@bp.route('/meals', methods=['POST'])
@jwt_required()
@role_required(['admin'])
def add_meal():
    data = request.get_json()

    dish_ids = data['dishes']
    dishes = Dish.query.filter(Dish.id.in_(dish_ids)).all()
    if len(dishes) != len(dish_ids):
        found_ids = {d.id for d in dishes}
        missing = [did for did in dish_ids if did not in found_ids]
        return jsonify({"error": f"Dish IDs not found: {missing}"}), 404
    meal = Meal(
        name=data['name'],
        price=int(data['price']),
        date=datetime.datetime.strptime(data['date'], "%Y-%m-%d")
    )
    meal.dishes = dishes

    db.session.add(meal)
    db.session.commit()

    return jsonify(meal.to_dict()), 200


@bp.route('/meals/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
@role_required(['admin'])
def meal_detail(id):
    meal = Meal.query.get_or_404(id)

    if not meal:
        return jsonify({"error": "Meal not found"}), 404

    if request.method == 'GET':
        return jsonify(meal.to_dict()), 200
    elif request.method == 'PUT':
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        if 'name' in data:
            if not isinstance(data['name'], str) or not data['name'].strip():
                return jsonify({"error": "Name must be a non-empty string"}), 400
            meal.name = data['name']
        if 'price' in data:
            try:
                meal.price = float(data['price'])
            except (TypeError, ValueError):
                return jsonify({"error": "Price must be a number"}), 400
        if 'date' in data:
            try:
                meal.date = datetime.datetime.strptime(data['date'], "%Y-%m-%d")
            except ValueError:
                return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
        if 'dishes' in data:
            if not isinstance(data['dishes'], list):
                return jsonify({"error": "'dishes' must be a list of dish IDs"}), 400
            dish_ids = data['dishes']
            if dish_ids:
                dishes = db.session.query(Dish).filter(Dish.id.in_(dish_ids)).all()
                if len(dishes) != len(dish_ids):
                    found_ids = {d.id for d in dishes}
                    missing = [did for did in dish_ids if did not in found_ids]
                    return jsonify({"error": f"Dish IDs not found: {missing}"}), 404
                meal.dishes = dishes
            else:
                meal.dishes = []

        db.session.commit()
        return jsonify(meal.to_dict()), 200

    elif request.method == 'DELETE':
        try:
            db.session.delete(meal)
            db.session.commit()
            return jsonify({"message": "Meal deleted successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Failed to delete meal"}), 500
    return None
