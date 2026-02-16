from flask import send_file, Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..models import Meal, User, Order, Subscription, Transaction
import datetime
from .. import db
from ..utils import role_required, create_notification
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
    if data['type'] not in ['lunch', 'breakfast']:
        return jsonify({"error": "invalid type: lunch or breakfast"}), 400
    if exsist and exsist.active is True:
        return jsonify({"error": "already subscribed"}), 400
    subsc = Subscription(
        user_id=get_jwt_identity(),
        type=data['type'],
        duration=20,
    )
    db.session.add(subsc)
    user.balance -= data['price']
    create_notification(user.id, "Новый абонемент", f"Вам поступил абонемент на {subsc.duration} {"обедов" if subsc.type == "lunch" else "завтраков"}")
    db.session.commit()
    return jsonify({"subscription": subsc.to_dict()}), 200


@bp.route('/subscription', methods=['GET'])
@jwt_required()
def get_subsc():
    subsc = Subscription.query.filter_by(user_id=get_jwt_identity()).all()
    subsc = [subs for subs in subsc if subsc.active is True]
    if subsc:
        return jsonify({"subscriptions": [subs.to_dict() for subs in subsc]}), 200
    return [], 200


from datetime import datetime, timedelta
from io import BytesIO
from fpdf import FPDF
from pathlib import Path

@bp.route('/report/orders/<int:days>', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def generate_orders_report(days):

    end_date = datetime.utcnow().date()
    start_date = end_date - timedelta(days=days)

    orders = Order.query.filter(Order.date >= start_date, Order.date <= end_date).all()

    total_price = sum(order.price or 0 for order in orders)
    given_count = sum(1 for order in orders if order.is_given)
    not_given_count = len(orders) - given_count
    subscription_count = sum(1 for order in orders if order.payment_type == 'subscription')
    balance_count = sum(1 for order in orders if order.payment_type == 'balance')

    pdf = FPDF()
    pdf.add_page()
    current_dir = Path(__file__).parent
    font_path = current_dir / "fonts" / "DejaVuSansCondensed.ttf"
    pdf.add_font("DejaVu", "", str(font_path), uni=True)

    pdf.set_font("DejaVu", size=14)

    pdf.cell(0, 10, txt="Отчёт по заказам", ln=True, align='C')
    pdf.ln(10)

    pdf.set_font("DejaVu", size=12)
    pdf.cell(0, 8, txt=f"Период: с {start_date.strftime('%d.%m.%Y')} по {end_date.strftime('%d.%m.%Y')}", ln=True)
    pdf.ln(5)
    pdf.cell(0, 8, txt=f"Суммарная цена заказов: {total_price} руб.", ln=True)
    pdf.cell(0, 8, txt=f"Выдано: {given_count}", ln=True)
    pdf.cell(0, 8, txt=f"Не выдано: {not_given_count}", ln=True)
    pdf.cell(0, 8, txt=f"Оплата абонементом: {subscription_count}", ln=True)
    pdf.cell(0, 8, txt=f"Оплата с баланса: {balance_count}", ln=True)

    return send_file(
        BytesIO(pdf.output()),
        mimetype='application/pdf',
        as_attachment=False,
        download_name=f'orders_report_{days}d.pdf'
    )