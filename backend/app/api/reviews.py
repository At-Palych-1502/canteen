from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..models import Review
import datetime
from .. import db
from ..utils import role_required

bp = Blueprint('reviews', __name__)

@bp.route('/reviews/<int:dish_id>', methods=['GET', 'DELETE', 'PUT'])
@jwt_required()
@role_required(['admin', 'student'])
def review(dish_id):
    if request.method == 'GET':
        reviews = Review.query.filter_by(dish_id=dish_id).all()
        return jsonify({"reviews": [review.to_dict() for review in reviews]}), 200
