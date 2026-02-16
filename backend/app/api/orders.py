from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User, Order, Meal, Subscription, Transaction
from datetime import datetime, date

from .. import db
from ..utils import role_required, create_notification

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
    date_str = data['date'].split('T')[0] if 'T' in data['date'] else data['date']
    date = datetime.strptime(date_str, '%Y-%m-%d').date()
    meal_id = data['meal_id']
    meal = Meal.query.get_or_404(meal_id)
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    day_of_week = date.strftime('%A').lower()
    if day_of_week != meal.day_of_week:
        return jsonify({"error": "This meal can't be ordered on this date"}), 400
    payment_type = data['payment_type'].lower()
    if payment_type not in ['subscription', 'balance']:
        return jsonify({"error": "Invalid payment type"}), 400

    if payment_type == 'subscription':
        subsc = Subscription.query.filter_by(user_id=user.id, type=meal.type).first()
        if not subsc:
            return jsonify({"error": "Subscription not found"}), 400
        if not subsc.is_active():
            return jsonify({"error": "Subscription not active"}), 400

        order = Order(user_id=user_id, date=date, meal_id=meal.id, payment_type=payment_type)
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

        order = Order(user_id=user_id, date=date, meal_id=meal.id, payment_type=payment_type, price=meal.price)
        db.session.add(order)
        db.session.flush()
        user.balance -= meal.price

        add_transaction(user_id, meal.price,
                        description=f"Произведен заказ питания на дату {data['date']}, общая цена: {meal.price}, оплата балансом")
        db.session.commit()
        return jsonify({"message": "success"}), 200


@bp.route('/orders', methods=['GET'])
@jwt_required()
def orders():
    orders = Order.query.all()
    return jsonify({"data": [order.to_dict() for order in orders]}), 200


@bp.route('/orders/<int:id>', methods=['GET', 'DELETE'])
@jwt_required()
def order_by_id(id):
    if request.method == 'GET':
        order = Order.query.get_or_404(id)
        return jsonify({"order": order.to_dict()})
    if request.method == 'DELETE':
        order = Order.query.get_or_404(id)
        if order.date <= datetime.today().date():
            return jsonify({"error": "Order on today or days before can't be deleted"}), 400
        user = User.query.get_or_404(get_jwt_identity())
        user.balance += order.price
        db.session.delete(order)
        db.session.commit()
        return jsonify({"message": "success"}), 200


@bp.route("/orders/<int:id>/set_given", methods=['PUT'])
@jwt_required()
@role_required(['admin', 'cook'])
def set_given(id):
    order = Order.query.get_or_404(id)
    user = User.query.get(get_jwt_identity())
    if order.is_given is False or order.is_given is None:
        order.is_given = True
        create_notification(order.user_id, "Вам было выдано питание", f"Уважаемый {user.name} {user.surname}! Вам было выдано питание: {order.meal.name} на дату {order.date}.")
    else:
        return jsonify({"error": "this order was already given"}), 400
    db.session.commit()
    return jsonify({"message": "Order given", "order": order.to_dict()})
