from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models import User, Dish, Ingredient, DishIngredient
from ..utils import role_required
from .. import db
bp = Blueprint('dish', __name__)



@bp.route('/dishes/<int:id>', methods=["GET", "DELETE", "PUT"])
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
        return jsonify({"data": dish.to_dict(include_ingredients=True)}), 200
    elif request.method == 'DELETE':
        db.session.execute(
            db.delete(DishIngredient).where(DishIngredient.dish_id == dish.id)
        )
        db.session.delete(dish)
        db.session.commit()
        return jsonify({"message": "Dish deleted"}), 200
    elif request.method == 'PUT':
        data = request.get_json()
        allowed_keys = ["name", "weight", "meal", "quantity", "ingredients"]
        if not all(key in allowed_keys for key in data.keys()):
            return jsonify({"error": "Not valid data"}), 400

        for key, value in data.items():
            if key != 'ingredients':
                setattr(dish, key, value)

        if 'ingredients' in data:
            db.session.query(DishIngredient).filter_by(dish_id=dish.id).delete()
            for ing_id in data["ingredients"]:
                ingredient = Ingredient.query.get_or_404(ing_id)
                dish_ing = DishIngredient(
                    ingredient_id=ingredient.id,
                    dish_id=dish.id
                )
                db.session.add(dish_ing)

        db.session.commit()
        return jsonify({"message": "Dish updated"}), 200



@bp.route('/dishes', methods=['POST'])
@jwt_required()
@role_required(["admin", "cook"])
def add_dish():
    data = request.get_json()
    f = data.get
    name = f("name")
    weight = f("weight")
    quantity = f("quantity")
    dish = Dish(
        name=name,
        weight=weight,
        quantity=quantity
    )
    db.session.add(dish)
    db.session.commit()

    return jsonify({"data": dish.to_dict()}), 201

@bp.route('/dishes', methods=['GET'])
@jwt_required()
@role_required(["admin", "cook"])
def dishes():
    dishes = Dish.query.all()
    sl = []
    for dish in dishes:
        sl.append(dish.to_dict())
    return jsonify({"data": sl}), 200

