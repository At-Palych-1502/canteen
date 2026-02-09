from flask import send_file, render_template, Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Meal, User, Order, Subscription, OrderMeal, Transaction, PurchaseRequest, Ingredient
import datetime
from datetime import timedelta
from .. import db
from ..utils import role_required
from sqlalchemy import or_
from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

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
    payment_type = data['payment_type']
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
def purch_req_accept(id):
    purch_req = PurchaseRequest.query.get_or_404(id)
    if purch_req.is_accepted is True or purch_req.is_accepted is False:
        purch_req.is_accepted = True
    else:
        return jsonify({"error": ""}), 400
    ingredient = Ingredient.query.get_or_404(purch_req.ingredient_id)
    ingredient.quantity += purch_req.quantity
    db.session.commit()
    return jsonify({"meal": purch_req.to_dict()}), 200


@bp.route('/purchase_requests/<int:id>/reject', methods=['PUT'])
@jwt_required()
@role_required(['admin'])
def purch_req_reject(id):
    purch_req = PurchaseRequest.query.get_or_404(id)
    if purch_req.is_accepted is True or purch_req.is_accepted is False:
        purch_req.is_accepted = False
        db.session.commit()
        return jsonify({"meal": purch_req.to_dict()}), 200
    else:
        return jsonify({"error": ""}), 400

@bp.route('/subscriptions', methods=['POST'])
@jwt_required()
@role_required(['student'])
def subscriptions():
    data = request.get_json()
    user = User.query.get_or_404(get_jwt_identity())
    if user.balance < data['price']:
        return jsonify({"error": "not enough balance"}), 400
    subsc = Subscription(
        user_id=get_jwt_identity(),
        type=data['type'],
        duration=20,
    )
    db.session.add(subsc)
    db.session.commit()


@bp.route('/report/orders', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def generate_orders_report():
    days = int(request.args.get('days'))

    if days not in {1, 3, 7}:
        return {"error": "Недопустимый период. Укажите 1, 3 или 7 дней."}, 400

    now = datetime.datetime.utcnow()
    start_date = (now - timedelta(days=days)).replace(hour=0, minute=0, second=0, microsecond=0)

    orders = Order.query.filter(Order.date >= start_date).order_by(Order.date.desc()).all()

    total_orders = len(orders)
    total_meals = sum(len(order.meals) for order in orders)
    unique_users = len(set(order.user_id for order in orders))

    # Создаём PDF в памяти
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.8 * inch, bottomMargin=0.6 * inch)
    styles = getSampleStyleSheet()
    story = []

    # Заголовок
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=12,
        alignment=1  # center
    )
    story.append(Paragraph("Отчёт по заказам", title_style))
    story.append(Spacer(1, 12))

    # Сводная информация
    summary_data = [
        ["Период:", f"{days} день(дней)"],
        ["С:", start_date.strftime("%d.%m.%Y")],
        ["По:", now.strftime("%d.%m.%Y %H:%M")],
        ["Всего заказов:", str(total_orders)],
        ["Всего блюд:", str(total_meals)],
        ["Уникальных учеников:", str(unique_users)],
    ]

    summary_table = Table(summary_data, colWidths=[2 * inch, 3 * inch])
    summary_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 18))

    # Таблица заказов
    if orders:
        story.append(Paragraph("Список заказов", styles['Heading2']))
        story.append(Spacer(1, 10))

        table_data = [["ID", "Дата", "Ученик (ID)", "Блюда"]]
        for order in orders:
            meals_str = ", ".join(meal.name for meal in order.meals) if order.meals else "—"
            table_data.append([
                str(order.id),
                order.date.strftime("%d.%m.%Y %H:%M"),
                str(order.user_id),
                meals_str
            ])

        # Автоподбор ширины колонок
        col_widths = [0.6 * inch, 1.5 * inch, 1.2 * inch, 3.2 * inch]
        orders_table = Table(table_data, colWidths=col_widths)
        orders_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        story.append(orders_table)
    else:
        story.append(Paragraph("За указанный период заказов не найдено.", styles['Normal']))

    # Генерация PDF
    doc.build(story)
    buffer.seek(0)

    filename = f"Отчёт_по_заказам_{days}дн_{now.strftime('%Y%m%d')}.pdf"
    return send_file(
        buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=filename
    )