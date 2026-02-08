from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User, Transaction, Meal, Order
import datetime
from .. import db
from ..utils import role_required

bp = Blueprint('business', __name__)

@bp.route('/menu', methods=['GET'])
@jwt_required()
def get_menu():
    date = datetime.datetime.strptime(request.get_json()['date'], '%Y-%m-%d')
    meals = Meal.query.filter_by(date=date).all()
    if not meals:
        return jsonify({"error": "There are no meals on this date"}), 400
    sl = []
    for meal in meals:
        sl.append(meal.to_dict())
    return jsonify(sl), 200


@bp.route('/order', methods=['POST'])
@jwt_required()
@role_required(['student'])
def post_order():
    user = User.query.get_or_404(get_jwt_identity())
    data = request.get_json()
    meal_ids = data['meals']
    meals = Meal.query.filter(Meal.id.in_(meal_ids)).all()
    if len(meals) != len(meal_ids):
        found_ids = {d.id for d in meals}
        missing = [did for did in meal_ids if did not in found_ids]
        return jsonify({"error": f"Dish IDs not found: {missing}"}), 404
    # order = Order.query.filter_by(user_id=user.id, date=datetime.datetime.strptime(data['date'], '%Y-%m-%d')).first()
    order = Order(
        user_id=user.id,
        date=datetime.datetime.strptime(data['date'], '%Y-%m-%d')
    )
    order.meals = meals
    db.session.add(order)
    db.session.commit()

# @bp.route('/order/<int:order_id>', methods=['GET', 'PUT', 'DELETE'])
# @jwt_required()
# def order(order_id):
#     if request.method == 'GET':
#         order = Order.query.get_or_404(order_id)
#         return order.to_dict()
#     if request.method == 'PUT':
#         data = request.get_json()
#         allowed_keys = ["name   ", "weight", "meal", "quantity"]
#         if not all(key in allowed_keys for key in data.keys()):
#             return jsonify({"error": "Not valid data"}), 400
#         for key, value in data.items():
#             setattr(dish, key, value)
#         db.session.commit()
#         return jsonify({"message": "Dish updated"}), 200