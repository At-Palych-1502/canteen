from app.models import User, Notification
from datetime import datetime

def test_create_notification_success(client, app):
    with app.app_context():
        # Создаем пользователя
        user_response = client.post('/api/auth/register', json={
            'username': 'testuser_notif',
            'email': 'testnotif@example.com',
            'password': 'testpassword',
            'name': 'Test',
            'surname': 'User',
            'patronymic': 'Testovich'
        })
        assert user_response.status_code == 200

        # ИСПРАВЛЕНИЕ: Получаем user_id из базы данных
        user = User.query.filter_by(username='testuser_notif').first()
        user_id = user.id

        # Логинимся
        login_response = client.post('/api/auth/login', json={
            'username': 'testuser_notif',
            'password': 'testpassword'
        })
        assert login_response.status_code == 200
        user_token = login_response.json['access_token']

        # Создаем уведомление
        from app.utils import create_notification
        response_data, status_code = create_notification(user_id, "Тестовое уведомление", "Это тестовое сообщение")

        assert status_code == 200
        assert response_data.json['message'] == "success"

        # Проверяем, что уведомление создалось в базе
        notifications = Notification.query.filter_by(user_id=user_id).all()
        assert len(notifications) == 1
        assert notifications[0].title == "Тестовое уведомление"
        assert notifications[0].message == "Это тестовое сообщение"
        assert notifications[0].is_read == False


def test_get_notifications(client, app):
    with app.app_context():
        # Создаем пользователя
        user_response = client.post('/api/auth/register', json={
            'username': 'testuser_get_notif',
            'email': 'testgetnotif@example.com',
            'password': 'testpassword',
            'name': 'Test',
            'surname': 'User',
            'patronymic': 'Testovich'
        })
        assert user_response.status_code == 200

        # ИСПРАВЛЕНИЕ: Получаем user_id из базы данных
        user = User.query.filter_by(username='testuser_get_notif').first()
        user_id = user.id

        # Логинимся
        login_response = client.post('/api/auth/login', json={
            'username': 'testuser_get_notif',
            'password': 'testpassword'
        })
        assert login_response.status_code == 200
        user_token = login_response.json['access_token']

        # Создаем уведомление
        from app.utils import create_notification
        create_notification(user_id, "Тест 1", "Сообщение 1")
        create_notification(user_id, "Тест 2", "Сообщение 2")

        # Получаем уведомления
        response = client.get('/api/notifications', headers={'Authorization': f'Bearer {user_token}'})

        assert response.status_code == 200
        assert 'notifications' in response.json
        assert len(response.json['notifications']) == 2

        # Проверяем, что уведомления пометились как прочитанные
        unread_notifications = Notification.query.filter_by(user_id=user_id, is_read=False).all()
        assert len(unread_notifications) == 0


def test_get_notifications_no_unread(client, app):
    with app.app_context():
        user_response = client.post('/api/auth/register', json={
            'username': 'testuser_no_unread',
            'email': 'testnounread@example.com',
            'password': 'testpassword',
            'name': 'Test',
            'surname': 'User',
            'patronymic': 'Testovich'
        })
        assert user_response.status_code == 200

        user = User.query.filter_by(username='testuser_no_unread').first()
        user_id = user.id

        login_response = client.post('/api/auth/login', json={
            'username': 'testuser_no_unread',
            'password': 'testpassword'
        })
        assert login_response.status_code == 200
        user_token = login_response.json['access_token']

        response = client.get('/api/notifications', headers={'Authorization': f'Bearer {user_token}'})

        assert response.status_code == 200
        assert 'notifications' in response.json
        assert len(response.json['notifications']) == 0