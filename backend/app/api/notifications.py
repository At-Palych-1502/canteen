from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Notification

from .. import db

bp = Blueprint('notifications', __name__)


@bp.route('/notifications', methods=['GET'])
@jwt_required()
def notifications():
    notifications = Notification.query.filter_by(user_id=int(get_jwt_identity()), is_read=False).all()
    for notif in notifications:
        notif.is_read = True
    db.session.commit()
    return jsonify({"notifications": [notif.to_dict() for notif in notifications]})
