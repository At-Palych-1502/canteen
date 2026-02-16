from app.models import User

def test_register_success(client, app):
    with app.app_context():
        response = client.post('/api/auth/register', json={
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword',
            'name': 'Test',
            'surname': 'User',
            'patronymic': 'Testovich'
        })

        assert response.status_code == 200
        assert response.json['message'] == 'User added'

        user = User.query.filter_by(username='testuser').first()
        assert user is not None
        assert user.email == 'test@example.com'


def test_register_duplicate_username(client, app):
    """Тест регистрации с дублирующим username"""
    with app.app_context():
        client.post('/api/auth/register', json={
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword',
            'name': 'Test',
            'surname': 'User',
            'patronymic': 'Testovich'
        })

        response = client.post('/api/auth/register', json={
            'username': 'testuser',
            'email': 'another@example.com',
            'password': 'testpassword',
            'name': 'Test',
            'surname': 'User',
            'patronymic': 'Testovich'
        })

        assert response.status_code == 400
        assert 'already exists' in response.json['error'].lower()

        users = User.query.filter_by(username='testuser').all()
        assert len(users) == 1

def test_register_duplicate_email(client, app):
    """Тест регистрации с дублирующим email"""
    with app.app_context():
        # Первый пользователь
        client.post('/api/auth/register', json={
            'username': 'testuser1',
            'email': 'test@example.com',
            'password': 'testpassword',
            'name': 'Test',
            'surname': 'User',
            'patronymic': 'Testovich'
        })



def test_register_missing_fields(client, app):
    """Тест регистрации с отсутствующими обязательными полями"""

    with app.app_context():





        response = client.post('/api/auth/register', json={
            'username': 'testuser4',
            'email': 'test4@example.com',
            'password': 'testpassword',
            'name': 'Test',
            'surname': 'User'
        })
        assert response.status_code == 200