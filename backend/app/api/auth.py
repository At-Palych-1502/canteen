from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models import User
from .. import db
from flask import jsonify

bp = Blueprint('auth', __name__)


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"error": "Invalid credentials"}), 401

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        access_token = create_access_token(
            identity=str(user.id)
        )
        return jsonify(access_token=access_token, user=user.to_dict()), 200
    return jsonify({"error": "Invalid credentials"}), 401

@bp.route('/user', methods=['GET'])
@jwt_required()
def user():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if not user:
        return jsonify({"error": "Not found"}), 404
    return jsonify(user=user.to_dict()), 200
