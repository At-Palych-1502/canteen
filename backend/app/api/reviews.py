from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Review
from .. import db
from ..utils import role_required

bp = Blueprint('reviews', __name__)

@bp.route('/reviews/<int:dish_id>', methods=['GET'])
@jwt_required()
def review(dish_id):
    if request.method == 'GET':
        reviews = Review.query.filter_by(dish_id=dish_id).all()
        return jsonify({"reviews": [review.to_dict() for review in reviews]}), 200


@bp.route('/review/<int:review_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def review_by_id(review_id):
    review = Review.query.get_or_404(review_id)
    data = request.get_json()

    if request.method == 'GET':
        return jsonify({"review": review.to_dict()}), 200
    elif request.method == 'PUT':
        if review.user_id != get_jwt_identity():
            return jsonify({"error": "You are not allowed to edit this review"}), 403
        allowed_keys = ['score', 'comment']
        if not all(key in allowed_keys for key in data.keys()):
            return jsonify({"error": "Invalid input"}), 400
        for key, value in data.items():
            setattr(review, key, value)
        db.session.commit()
        return jsonify({"review": review.to_dict()}), 200
    elif request.method == 'DELETE':
        if review.user_id != get_jwt_identity():
            return jsonify({"error": "You are not allowed to delete this review"}), 403
        db.session.delete(review)
        db.session.commit()
        return jsonify({"message": "Review deleted"}), 200


@bp.route('/reviews/<int:dish_id>', methods=['POST'])
@jwt_required()
def create_review(dish_id):
    data = request.get_json()
    if data['score'] not in [1, 2, 3, 4, 5]:
        return jsonify({"error": "Invalid input"}), 400
    review = Review(
        dish_id=dish_id,
        user_id=get_jwt_identity(),
        score=data['score'],
        comment=data['comment']
    )
    db.session.add(review)
    db.session.commit()
    return jsonify({"review": review.to_dict()}), 200