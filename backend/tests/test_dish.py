from app.models import Dish, Ingredient, User

def test_user_becomes_admin_and_adds_dish(client, app):
    """Тест: администратор добавляет блюдо"""
    with app.app_context():


        # Логинимся как администратор с предопределенными учетными данными
        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })

        assert 'access_token' in admin_login.json

        # AssertionError: assert 'access_token' in {'error': 'Invalid credentials'}         не получается авторизоваться

        admin_token = admin_login.json['access_token']
        admin_user = admin_login.json['user']
        assert admin_user['role'] == 'admin'  # Проверяем, что это действительно администратор

        print(admin_login.status_code, admin_user['role'])# Выдаёт ошибку 401 не понимаю почему :(




        # Добавляем блюдо с пустым списком ингредиентов
        response = client.post('/api/dishes', json={
            'name': 'Admin Test Dish',
            'weight': 250,
            'ingredients': []
        }, headers={'Authorization': f'Bearer {admin_token}'})

        assert response.status_code == 200
        assert 'dish' in response.json
        assert response.json['dish']['name'] == 'Admin Test Dish'

        # Проверяем, что блюдо действительно добавилось
        response_get = client.get('/api/dishes', headers={'Authorization': f'Bearer {admin_token}'})
        assert response_get.status_code == 200
        assert 'data' in response_get.json
        dish_names = [dish['name'] for dish in response_get.json['data']]
        assert 'Admin Test Dish' in dish_names