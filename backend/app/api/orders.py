from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User, Order, Meal, Subscription, Transaction, OrderMeal
import datetime

from .. import db
from ..utils import role_required

bp = Blueprint('orders', __name__)

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

@bp.route('/order', methods=['POST'])
@jwt_required()
def order():
    data = request.get_json()
    date = datetime.date.strptime(data['date'], '%Y-%m-%d')
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

    else:
        if user.balance < total_price:
            return jsonify({"error": "You don't have enough money"}), 400

        order = Order(user_id=user_id, date=date)
        db.session.add(order)
        db.session.flush()

        for meal in meals:
            ord_meal = OrderMeal(order_id=order.id, meal_id=meal.id)
            db.session.add(ord_meal)

        add_transaction(user_id, total_price,
                        description=f"Произведен заказ питания на дату {data['date']}, общая цена: {total_price}")
        db.session.commit()
        return jsonify({"message": "success"}), 200

@bp.route('/orders', methods=['GET'])
@jwt_required()
@role_required(['admin', 'cook'])
def orders():
    orders = Order.query.all()
    return jsonify({"data": [order.to_dict() for order in orders]}), 200

@bp.route('/orders/<int:id>', methods=['GET'])
@jwt_required()
def order_by_id(id):
    if request.method == 'GET':
        order = Order.query.get_or_404(id)
        return jsonify({"order": order.to_dict()})