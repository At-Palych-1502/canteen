from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models import User, Notification
from ..utils import role_required
from .. import db

bp = Blueprint('notifications', __name__)
@bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    notifications = Notification.query.filter_by(user_id=get_jwt_identity()).all()
    return jsonify({"notifications": [notific.to_dict() for notific in notifications]}), 200


@bp.route('/notifications/read', methods=['PUT'])
@jwt_required()
def read_notifications():
    data = request.get_json()
    notif_id = data["notification_id"]
    notification = Notification.query.filter(Notification.id.in_([notif_id])).all()
    for notif in notification:
        notif.is_read = True
    db.session.commit()
    return jsonify({"message": "success"}), 200