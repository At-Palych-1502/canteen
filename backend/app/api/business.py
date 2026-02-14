from flask import send_file, render_template, Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from fpdf import FPDF
from reportlab.pdfgen import canvas

from ..models import Meal, User, Order, Subscription, Transaction, PurchaseRequest, Ingredient
import datetime
from datetime import timedelta
from .. import db
from ..utils import role_required
from sqlalchemy import or_
from io import BytesIO


bp = Blueprint('business', __name__)


def add_transaction(user_id, amount, description):
    user = User.query.get(user_id)
    if not user:
        return False
    transaction = Transaction(
        user_id=user_id,
        amount=amount,
        description=description
    )
    db.session.add(transaction)
    db.session.commit()
    return True


@bp.route('/menu', methods=['GET'])
@jwt_required()
def get_menu():
    day_of_week = request.args.get('day_of_week')
    meals = Meal.query.filter_by(day_of_week=day_of_week).all()
    if not meals:
        return jsonify({"error": "There are no meals on this date"}), 400
    return jsonify({"meals": [meal.to_dict() for meal in meals]})


@bp.route('/users/filter')
@jwt_required()
@role_required(['admin'])
def filter_users():
    args = request.args
    per_page = int(args.get('per_page'))
    username = args.get('username')
    name = args.get('name')
    surname = args.get('surname')
    patronymic = args.get('patronymic')
    email = args.get('email')
    role = args.get('role')
    if per_page < 1 or per_page > 20:
        per_page = 10

    page = request.args.get('page', 1, type=int)

    users_query = User.query.filter(
        or_(
            User.username.ilike(f'%{username}%'),
            User.email.ilike(f'%{email}%'),
            User.role.ilike(f'%{role}%'),
            User.name.ilike(f'%{name}%'),
            User.surname.ilike(f'%{surname}%'),
            User.patronymic.ilike(f'%{patronymic}%'),
        )
    )

    pagination = users_query.paginate(
        page=page,
        per_page=per_page,
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


@bp.route('/set_meals_count', methods=['PUT'])
@jwt_required()
@role_required(['cook'])
def set_meals_count():
    data = request.get_json()
    meals = data['meals']
    for meal_ls in meals:
        meal = Meal.query.get_or_404(meal_ls["id"])
        meal.quantity = meal_ls["quantity"]
        db.session.commit()
    return jsonify({"message": "meals updated"}), 200


@bp.route('/subscriptions', methods=['POST'])
@jwt_required()
@role_required(['student'])
def subscriptions():
    data = request.get_json()
    user = User.query.get_or_404(get_jwt_identity())
    if user.balance < data['price']:
        return jsonify({"error": "not enough balance"}), 400
    exsist = Subscription.query.filter_by(user_id=user.id).first()
    if exsist and exsist.active is True:
        return jsonify({"error": "already subscribed"}), 400
    subsc = Subscription(
        user_id=get_jwt_identity(),
        type=data['type'],
        duration=20,
    )
    db.session.add(subsc)
    user.balance -= data['price']
    db.session.commit()
    return jsonify({"subscription": subsc.to_dict()}), 200


@bp.route('/report/orders', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def generate_orders_report():
    pdf = FPDF()
    pdf.add_page()
    return send_file(
        BytesIO(pdf.output()),
        mimetype='application/pdf',
        as_attachment=False,
        download_name='empty.pdf'
    )
