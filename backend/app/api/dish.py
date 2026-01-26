from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models import User, Dish
from ..utils import role_required
from .. import db
bp = Blueprint('dish', __name__)



@bp.route('/dish/<int:id>', methods=["GET", "DELETE", "PUT"])
@jwt_required()
@role_required(["admin", "cook"])
def dish(id):
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if not user:
        return jsonify({"error": "Not valid json token"}), 404
    dish = Dish.query.get_or_404(id)
    if not dish:
        return jsonify({"error": "Not found"}), 404

    if request.method == 'GET':
        if not dish:
            return jsonify({"error": "Dish not found"}), 404
        return jsonify({"data": dish.to_dict()}), 200
    elif request.method == 'DELETE':
        db.session.delete(dish)
        db.session.commit()
        return jsonify({"message": "Dish deleted"}), 200
    else:
        data = request.get_json()
        allowed_keys = ["name", "weight", "meal", "quantity"]
        if not all(key in allowed_keys for key in data.keys()):
            return jsonify({"error": "Not valid data"}), 400
        for key, value in data.items():
            setattr(dish, key, value)
        db.session.commit()
        return jsonify({"message": "Dish updated"}), 200


@bp.route('/add_dish', methods=['POST'])
@jwt_required()
@role_required(["admin", "cook"])
def add_dish():
    data = request.get_json()
    f = data.get
    name = f("name")
    weight = f("weight")
    cost = f("cost")
    meal = f("meal")
    quantity = f("quantity")
    dish = Dish(
        name=name,
        weight=weight,
        meal=meal,
        quantity=quantity
    )
    db.session.add(dish)
    db.session.commit()
    return jsonify({"id": dish.id}), 200