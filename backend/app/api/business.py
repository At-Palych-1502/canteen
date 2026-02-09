from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Meal, User, Order, OrderMeal, Transaction
import datetime
from .. import db
from ..utils import role_required
from sqlalchemy import or_

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
    sl = []
    for meal in meals:
        sl.append(meal.to_dict())
    return jsonify(sl), 200

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
    user = User.query.get_or_404(get_jwt_identity())
    meals = []
    for id in meal_ids:
        meals.append(Meal.query.get_or_404(id))
    total_price = sum([meal.price for meal in meals])
    if user.balance < total_price:
        return jsonify({"error": "You don't have enough money"}), 400
    add_transaction(user.id, total_price, description=f"Произведен заказ питания на дату {data['date']}, общая цена: {total_price}")
    order = Order(
        user_id=get_jwt_identity(),
        date=date
    )
    db.session.add(order)
    db.session.flush()

    for meal in meals:
        ord_meal = OrderMeal(
            order_id=order.id,
            meal_id=meal.id
        )
        db.session.add(ord_meal)
    db.session.commit()
    return jsonify({"order": order.to_dict()}), 200

@bp.route('/orders', methods=['GET'])
@jwt_required()
@role_required(['admin', 'cook'])
def orders():
    orders = Order.query.all()
    return jsonify({"data": [order.to_dict() for order in orders]}), 200


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

@bp.route('/purchase_requests', methods=['POST', 'GET'])
@jwt_required()
@role_required(['admin', 'cook'])
def purchase_request():
    if request.method == 'GET':
        return {"purchase_requests": [purch_req.to_dict() for purch_req in PurchaseRequest.query.all()]}
    data = request.get_json()
    purchase_req = PurchaseRequest(
        user_id=get_jwt_identity(),
        ingredient_id=data['ingredient_id'],
        quantity=data['quantity'],
    )
    db.session.add(purchase_req)
    db.session.commit()
    return jsonify({"purchase_req": purchase_req.to_dict()}), 200

@bp.route('/purchase_requests/<int:id>/accept', methods=['PUT'])
@jwt_required()
@role_required(['admin'])
def meals(id):
    purch_req = PurchaseRequest.query.get_or_404(id)
    purch_req.is_accepted = True
    db.session.commit()
    return jsonify({"meal": purch_req.to_dict()}), 200


