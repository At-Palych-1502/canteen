from functools import wraps
from flask import jsonify, current_app
from flask_jwt_extended import verify_jwt_in_request, get_jwt

def role_required(allowed_roles):
    def wraper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            user_role = claims.get('role')
            if user_role not in allowed_roles:
                return jsonify({"error": "Access denied"}), 403
            return fn(*args, **kwargs)
        return decorator
    return wraper


def create_notification(user_id, title, message, app=None):
    if app:
        with app.context():
            from .models import Notification, db

            notif = Notification(
                user_id=user_id,
                title=title,
                message=message,
                is_read=False
            )
            db.session.add(notif)
            db.session.commit()
            return jsonify({
                "message": "success",
                "notification_id": notif.id,
            }), 200
    else:
        from .models import Notification, db

        notif = Notification(
            user_id=user_id,
            title=title,
            message=message,
            is_read=False
        )
        db.session.add(notif)
        db.session.commit()
        return jsonify({
            "message": "success",
            "notification_id": notif.id,
        }), 200


def mark_notification_as_read(notification_id, app=None):
    if app:
        with app.context():
            from .models import Notification, db

            notification = Notification.query.get(notification_id)
            if not notification:
                return {
                    'success': False,
                    'error': 'Notification not found',
                    'message': 'Notification with specified ID does not exist'
                }
            if notification.is_read:
                return {
                    'success': True,
                    'message': 'Notification already marked as read'
                }
            notification.is_read = True
            db.session.commit()
            return {
                'success': True,
                'notification_id': notification_id,
                'message': 'Notification marked as read'
            }
    else:
        from .models import Notification, db

        notification = Notification.query.get(notification_id)
        if not notification:
            return {
                'success': False,
                'error': 'Notification not found',
                'message': 'Notification with specified ID does not exist'
            }
        if notification.is_read:
            return {
                'success': True,
                'message': 'Notification already marked as read'
            }
        notification.is_read = True
        db.session.commit()
        return {
            'success': True,
            'notification_id': notification_id,
            'message': 'Notification marked as read'
        }