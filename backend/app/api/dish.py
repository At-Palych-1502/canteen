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
    if not data:
        return jsonify({"error": "Bad request"}), 400

    name = data.get("name")
    weight = data.get("weight")
    ingredients = data.get("ingredients")
    quantity = data.get("quantity")

    if not name or not weight:
        return jsonify({"error": "Bad request"}), 400

    if not isinstance(weight, int) or weight <= 0:
        return jsonify({"error": "Invalid weight"}), 400

    if not isinstance(ingredients, list):
        return jsonify({"error": "Invalid ingredients' ids"}), 400

    dish = Dish(
        name=name,
        weight=weight,
    )
    if quantity:
        dish.quantity = quantity
    db.session.add(dish)
    db.session.flush()

    dish_ingredient_objects = []
    for ing_id in ingredients:
        if not isinstance(ing_id, int):
            return jsonify({"error": f"Invalid ingredients' id: {ing_id}"}), 400

        ingredient_exists = db.session.query(Ingredient.id).filter_by(id=ing_id).first()
        if not ingredient_exists:
            return jsonify({"error": f"Ingredient {ing_id} not found"}), 404
        dish_ingredient_objects.append(
            DishIngredient(dish_id=dish.id, ingredient_id=ing_id)
        )
    db.session.add_all(dish_ingredient_objects)
    db.session.commit()
    return jsonify({
        "message": "Dish added",
        "dish": dish.to_dict(include_ingredients=True)
    }), 200


@bp.route('/dishes', methods=['GET'])
@jwt_required()
@role_required(["admin", "cook"])
def dishes():
    dishes = Dish.query.all()
    sl = []
    for dish in dishes:
        sl.append(dish.to_dict())
    return jsonify({"data": sl}), 200



@bp.route('/dishes/off', methods=['PUT'])
@role_required(['cook', 'admin'])
def dishes_offs():
    data = request.get_json()
    quantity = data['quantity']
    dish_id = data['dish_id']
    dish = Dish.query.get_or_404(dish_id)
    if dish.quantity < quantity:
        return jsonify({"error": "There're no enough dishes to off"}), 400
    dish.quantity -= quantity
    db.session.commit()
    return jsonify({"message": "success", "dish": dish.to_dict()}), 200


@bp.route('/dishes/up', methods=['PUT'])
@role_required(['admin', 'cook'])
def dishes_up():
    data = request.get_json()
    quantity = data['quantity']
    dish_id = data['dish_id']
    off_ingredients = data['off_ingredients']
    dish = Dish.query.get_or_404(dish_id)
    not_enough_ingredients = []
    if off_ingredients:
        dish_ingredients = DishIngredient.query.filter_by(dish_id=dish_id).all()
        ingredients = [Ingredient.query.get(dish_ingredient.ingredient_id) for dish_ingredient in dish_ingredients]
        for ingredient in ingredients:
            to_off = quantity * DishIngredient.query.filter_by(ingredient_id=ingredient.id, dish_id=dish_id).first().weight
            if ingredient.quantity < to_off:
                not_enough_ingredients.append(ingredient.to_dict())
    if len(not_enough_ingredients):
        return jsonify({"error": "Not enough ingredients", "ingredients": not_enough_ingredients}), 400
    dish.quantity += quantity
    db.session.commit()
    return jsonify({"message": "success", "dish": dish.to_dict()}), 200
