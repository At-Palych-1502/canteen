from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User, Dish, Ingredient
from ..utils import role_required
from .. import db

bp = Blueprint('allergies', __name__)

@bp.route('/allergy', methods=['POST'])
@jwt_required()
def allergies():
    data = request.get_json()
    user = User.query.get_or_404(data)