from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User, Order, Meal, Subscription, Transaction
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
    meal_id = data['meal_id']
    meal = Meal.query.get_or_404(meal_id)
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    payment_type = data['payment_type'].lower()
    if payment_type not in ['subscription', 'balance']:
        return jsonify({"error": "Invalid payment type"}), 400

    if payment_type == 'subscription':
        subsc = Subscription.query.filter_by(user_id=user.id, type=meal.type).first()
        if not subsc:
            return jsonify({"error": "Subscription not found"}), 400
        if not subsc.is_active():
            return jsonify({"error": "Subscription not active"}), 400

        order = Order(user_id=user_id, date=date, meal_id=meal.id)
        db.session.add(order)
        db.session.flush()

        subsc.duration -= 1
        add_transaction(user_id, meal.price,
                            description=f"Произведен заказ питания на дату {data['date']}, общая цена: {meal.price}, оплата абонементом")
        db.session.commit()
        return jsonify({"message": "success"}), 200

    else:
        if meal.price > user.balance:
            return jsonify({"error": "You don't have enough money"}), 400

        order = Order(user_id=user_id, date=date, meal_id=meal.id)
        db.session.add(order)
        db.session.flush()
        user.balance -= meal.price

        add_transaction(user_id, meal.price,
                            description=f"Произведен заказ питания на дату {data['date']}, общая цена: {meal.price}, оплата балансом")
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