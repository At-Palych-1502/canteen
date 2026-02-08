from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models import User, Transaction, Meal
import datetime
from .. import db
from ..utils import role_required

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
