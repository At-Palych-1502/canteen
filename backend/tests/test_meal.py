from app.models import Meal, Dish, User

def test_create_meal_success(client, app):
    with app.app_context():
        
        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        assert 'access_token' in admin_login.json
        admin_token = admin_login.json['access_token']
        assert 'user' in admin_login.json
        assert admin_login.json['user']['role'] == 'admin'

        # Создаем тестовое блюдо
        dish_response = client.post('/api/dishes', json={
            'name': 'Test Dish for Meal',
            'weight': 200,
            'ingredients': []
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert dish_response.status_code == 200
        assert 'dish' in dish_response.json
        dish_id = dish_response.json['dish']['id']

        # Создаем обед
        meal_response = client.post('/api/meals', json={
            'name': 'Test Meal',
            'price': 100.0,
            'type': 'lunch',
            'dishes': [dish_id],
            'day_of_week':'Monday'
        }, headers={'Authorization': f'Bearer {admin_token}'})

        assert meal_response.status_code == 200

        # Проверяем, что обед действительно добавился
        meals_response = client.get('/api/meals', headers={'Authorization': f'Bearer {admin_token}'})
        assert meals_response.status_code == 200
