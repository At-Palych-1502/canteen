from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models import User, Dish
from ..utils import role_required
from .. import db
bp = Blueprint('dish', __name__)



@bp.route('/dish/add', methods=["POST"])
@jwt_required()
@role_required(["admin"])
def add():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if not user:
        return jsonify({"error": "Not valid json token"}), 404
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
        cost=cost,
        meal=meal,
        quantity=quantity
    )
    db.session.add(dish)
    db.session.commit()
    return jsonify({"id": dish.id}), 200
