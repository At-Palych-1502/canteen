from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models import User, Transaction
from datetime import timedelta
from .. import db
from ..utils import role_required


bp = Blueprint('balance', __name__)


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

@bp.route('/balance', methods=['GET'])
@jwt_required()
@role_required(['student'])
def get_balance():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify({
        'balance': user.balance
    })



@bp.route('/balance/topup', methods=['PUT'])
@jwt_required()
@role_required(['student'])
def balance_topup():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    amount = data['amount']
    description = data.get('description') if data.get('description') else ''
    if not (isinstance(amount, int) or isinstance(amount, float)) or amount <= 0:
        return jsonify({'message': 'Invalid amount'}), 400

    user.balance += amount
    db.session.commit()
    add_transaction(user.id, amount, description)
    return jsonify({'message': 'Balance updated',
                    'user_id': user.id,
                    'new_balance': user.balance}), 200


@bp.route('/balance/deduct', methods=['PUT'])
@jwt_required()
@role_required(['student'])
def balance_deduct():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    amount = data['amount']
    description = data.get('description') if data.get('description') else ''
    if not (isinstance(amount, int) or isinstance(amount, float)) or amount <= 0:
        return jsonify({'message': 'Invalid amount'}), 400
    if user.balance < amount:
        return jsonify({'message': 'Not enough balance'}), 400
    user.balance -= amount
    db.session.commit()
    add_transaction(user.id, amount, description)
    return jsonify({'message': 'Balance updated',
                    'user_id': user.id,
                    'new_balance': user.balance}), 200