from flask import send_file, render_template, Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Meal, User, Order, Subscription, OrderMeal, Transaction, PurchaseRequest, Ingredient
import datetime
from datetime import timedelta
from .. import db
from ..utils import role_required
from sqlalchemy import or_
from io import BytesIO
from fpdf import FPDF
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
    day_of_week = request.get_json()['day_of_week']
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

@bp.route('/order', methods=['POST'])
@jwt_required()
def order():
    data = request.get_json()
    date = datetime.datetime.strptime(data['date'], '%Y-%m-%d')
    meal_ids = data['meals']
    meals = [Meal.query.get_or_404(id) for id in meal_ids]
    total_price = sum(meal.price for meal in meals)
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    payment_type = data['payment_type'].lower()
    if payment_type not in ['subscription', 'balance']:
        return jsonify({"error": "Invalid payment type"}), 400

    if payment_type == 'subscription':
        subsc = Subscription.query.filter_by(user_id=user.id).first()
        if not (subsc and subsc.active):
            return jsonify({"error": "Subscription not active"}), 400

        order = Order(user_id=user_id, date=date)
        db.session.add(order)
        db.session.flush()

        for meal in meals:
            ord_meal = OrderMeal(order_id=order.id, meal_id=meal.id)
            db.session.add(ord_meal)

        subsc.duration -= 1
        add_transaction(user_id, total_price,
                        description=f"Произведен заказ питания на дату {data['date']}, общая цена: {total_price}, оплата абонементом")
        db.session.commit()
        return jsonify({"message": "success"}), 200

    else:  # balance
        if user.balance < total_price:
            return jsonify({"error": "You don't have enough money"}), 400

@bp.route('/orders_by_meal')
@jwt_required()
@role_required(['admin', 'cook'])
def orders_by_meal():
    args = request.args
    meal_id = args.get('meal_id')
    date = datetime.date.today()
    orders_meals = OrderMeal.query.filter_by(meal_id=meal_id).all()
    count = 0
    for order_meal in orders_meals:
        if Order.query.get_or_404(order_meal.order_id).first().date == date:
            count += 1
    return jsonify({"count": count})

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
