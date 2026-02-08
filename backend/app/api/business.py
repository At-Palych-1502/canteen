from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..models import Meal, User
import datetime
from .. import db
from ..utils import role_required
from sqlalchemy import or_

bp = Blueprint('business', __name__)

@bp.route('/menu', methods=['GET'])
@jwt_required()
def get_menu():
    date = datetime.datetime.strptime(request.get_json()['date'], '%Y-%m-%d')
    meals = Meal.query.filter_by(date=date).all()
    if not meals:
        return jsonify({"error": "There are no meals on this date"}), 400
    sl = []
    for meal in meals:
        sl.append(meal.to_dict())
    return jsonify(sl), 200

@bp.route('/users/filter')
@jwt_required()
@role_required(['admin'])
def filter_users():
    args = request.args
    username = args.get('username')
    email = args.get('email')
    role = args.get('role')

    page = request.args.get('page', 1, type=int)

    users_query = User.query.filter(
        or_(
            User.username.ilike(f'%{username}%'),
            User.email.ilike(f'%{email}%'),
            User.role.ilike(f'%{role}%')
        )
    )

    pagination = users_query.paginate(
        page=page,
        per_page=8,
        error_out=False
    )
    users = pagination.items
    return jsonify({"users": [user.to_dict() for user in users],
                    "pagination": {
                        "page": pagination.page,
                        "pages": pagination.pages,
                        "per_page": pagination.per_page,
                        "total": pagination.total,
                        "has_next": pagination.has_next,
                        "has_prev": pagination.has_prev
                    }})