from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User, Dish, Ingredient, UserAllergies
from ..utils import role_required
from .. import db


bp = Blueprint('ingredient', __name__)

@bp.route('ingredients/<int:id>', methods=['GET', 'DELETE', 'PUT'])
@jwt_required()
@role_required(['admin', 'cook'])
def ingredient(id):
    ingredient = Ingredient.query.get_or_404(id)
    if not ingredient:
        return jsonify({'error': 'Not found'}), 404
    if request.method == 'GET':
        return jsonify({'ingredient': ingredient.to_dict(include_dishes=True)})
    elif request.method == 'DELETE':
        db.session.delete(ingredient)
        db.session.commit()
        return jsonify({'message': 'ingredient deleted'}), 200
    else:
        data = request.get_json()
        allowed_keys = ["name"]
        if not all(key in allowed_keys for key in data.keys()):
            return jsonify({"error": "Not valid data"}), 400
        for key, value in data.items():
            setattr(ingredient, key, value)
        db.session.commit()
        return jsonify({'message': 'ingredient updated'}), 200

@bp.route('ingredients', methods=['POST'])
@jwt_required()
@role_required(['admin', 'cook'])
def add_ingredient():
    data = request.get_json()
    ingredient = Ingredient(
        name=data['name']
    )
    db.session.add(ingredient)
    db.session.commit()
    return jsonify({'ingredient': ingredient.to_dict()}), 201


@bp.route('ingredients', methods=['GET'])
@jwt_required()
@role_required(['admin', 'cook'])
def ingredients():
    ingredients = Ingredient.query.all()
    sl = {}
    for ingredient in ingredients:
        sl[ingredient.id] = ingredient.to_dict()
    return jsonify({'data': sl})


@bp.route('add_allergic_ingredient/<int:id>', methods=['POST'])
@role_required(['student'])
@jwt_required()
def add_allergic_ingredient(id):
    ingredient = Ingredient.query.get_or_404(id)
    user = User.query.get_or_404(get_jwt_identity())
    existing = UserAllergies.query.filter_by(user_id=user.id, ingredient_id=ingredient.id).first()
    if existing:
        return jsonify({'error': 'Ingredient-allergy relationship already exists'}), 208
    allergy = UserAllergies(
        user_id=user.id,
        ingredient_id=ingredient.id,
    )
    db.session.add(allergy)
    db.session.commit()
    return jsonify({'message': 'successfully added allergy'}), 200