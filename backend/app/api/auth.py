from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models import User
from datetime import timedelta
from .. import db
from ..utils import role_required

bp = Blueprint('auth', __name__)


@bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    remember_me = data.get('remember_me') or False
    if not username or not password:
        return jsonify({"error": "Invalid credentials"}), 401

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        if remember_me:
            access_token = create_access_token(
            identity=str(user.id),
            additional_claims={"role": user.role},
            expires_delta=timedelta(days=7)
            )
        else:
            access_token = create_access_token(
                identity=str(user.id),
                additional_claims={"role": user.role},
                expires_delta=timedelta(hours=1))
        return jsonify(access_token=access_token, user=user.to_dict()), 200
    return jsonify({"error": "Invalid credentials"}), 401


@bp.route('/user', methods=['GET'])
@jwt_required()
def user():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if not user:
        return jsonify({"error": "Not valid json token"}), 404
    return jsonify(user=user.to_dict()), 200

@bp.route('/users', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def users():
    Users = User.query.all()
    print(Users)
    return jsonify({"data": [user.to_dict() for user in Users]}), 200


@bp.route('/user/<int:id>', methods=['GET'])
@jwt_required()
@role_required(['cook', 'admin'])
def user_id(id):
    user = User.query.get_or_404(id)
    return jsonify(user=user.to_dict()), 200

@bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    name = data.get('name')
    surname = data.get('surname')
    patronymic = data.get('patronymic')
    balance = 0

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400
    password = data.get('password')

    user = User(
        username=username,
        email=email,
        role='student',
        name=name,
        surname=surname,
        patronymic=patronymic,
        balance=balance
    )
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User added"}), 200


@bp.route('/change_role/<int:id>', methods=['PUT'])
@jwt_required()
@role_required(['admin'])
def change_role(id):
    user = User.query.get_or_404(id)
    data = request.get_json()
    if data['role'] not in ['student', 'admin', 'cook']:
        return jsonify({"error": "Invalid role"}), 400
    user.role = data["role"]
    db.session.commit()
    return jsonify(user=user.to_dict()), 200