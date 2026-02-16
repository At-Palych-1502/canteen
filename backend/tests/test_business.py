from app.models import User, Meal, Order, Subscription, Transaction, PurchaseRequest, Ingredient
from datetime import datetime, date, timedelta
from datetime import date, timedelta
from unittest.mock import patch
from io import BytesIO

def test_filter_users(client, app):
    with app.app_context():

        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']


        user_response = client.post('/api/auth/register', json={
            'username': 'findme',
            'email': 'findme@example.com',
            'password': 'testpassword',
            'name': 'Find',
            'surname': 'Me',
            'patronymic': 'Testovich'
        })
        assert user_response.status_code == 200

        response = client.get('/api/users/filter?username=findme&per_page=10&page=1', headers={'Authorization': f'Bearer {admin_token}'})

        assert response.status_code == 200
        assert 'users' in response.json
        assert len(response.json['users']) >= 1
        assert response.json['users'][0]['username'] == 'findme'


def test_set_meals_count(client, app):
    with app.app_context():
        cook_login = client.post('/api/auth/login', json={
            'username': 'cook',
            'password': 'password',
            "remember_me": True
        })
        assert cook_login.status_code == 200
        cook_token = cook_login.json['access_token']

        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']

        dish_response = client.post('/api/dishes', json={
            'name': 'Test Dish for Set Count',
            'weight': 200,
            'ingredients': []
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert dish_response.status_code == 200
        dish_id = dish_response.json['dish']['id']

        meal_response = client.post('/api/meals', json={
            'name': 'Test Meal for Set Count',
            'price': 200,
            'type': 'lunch',
            'dishes': [dish_id],
            'day_of_week': 'Tuesday',
            'quantity': 0
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert meal_response.status_code == 200
        meal_id = meal_response.json['id']

        response = client.put('/api/set_meals_count', json={
            'meals': [
                {'id': meal_id, 'quantity': 10}
            ]
        }, headers={'Authorization': f'Bearer {cook_token}'})

        assert response.status_code == 200
        assert response.json['message'] == 'meals updated'

        get_response = client.get('/api/meals', headers={'Authorization': f'Bearer {admin_token}'})
        assert get_response.status_code == 200
        meal = next((m for m in get_response.json['meals'] if m['id'] == meal_id), None)
        assert meal is not None
        assert meal['quantity'] == 10


def test_create_subscription(client, app):
    with app.app_context():
        user_response = client.post('/api/auth/register', json={
            'username': 'testuser_sub',
            'email': 'testsub@example.com',
            'password': 'testpassword',
            'name': 'Test',
            'surname': 'User',
            'patronymic': 'Testovich'
        })
        assert user_response.status_code == 200

        login_response = client.post('/api/auth/login', json={
            'username': 'testuser_sub',
            'password': 'testpassword'
        })
        assert login_response.status_code == 200
        access_token = login_response.json['access_token']

        client.put('/api/balance/topup', json={
            'amount': 5000,
            'description': 'Test topup'
        }, headers={'Authorization': f'Bearer {access_token}'})

        response = client.post('/api/subscriptions', json={
            'type': 'lunch',
            'price': 4000
        }, headers={'Authorization': f'Bearer {access_token}'})

        assert response.status_code == 200
        assert 'subscription' in response.json
        assert response.json['subscription']['type'] == 'lunch'
        assert response.json['subscription']['duration'] == 20

        user_get = client.get('/api/user', headers={'Authorization': f'Bearer {access_token}'})
        assert user_get.status_code == 200




def test_generate_orders_report(client, app):
    with app.app_context():
        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200, f"Admin login failed: {admin_login.json}"
        admin_token = admin_login.json['access_token']
        admin_headers = {'Authorization': f'Bearer {admin_token}'}

        user_response = client.post('/api/auth/register', json={
            'username': 'reportuser',
            'email': 'report@example.com',
            'password': 'testpassword',
            'name': 'Report',
            'surname': 'User',
            'patronymic': 'Testovich'
        })
        assert user_response.status_code == 200, f"User registration failed: {user_response.json}"

        login_response = client.post('/api/auth/login', json={
            'username': 'reportuser',
            'password': 'testpassword'
        })
        assert login_response.status_code == 200, f"User login failed: {login_response.json}"
        user_token = login_response.json['access_token']
        user_headers = {'Authorization': f'Bearer {user_token}'}

        topup_response = client.put('/api/balance/topup', json={
            'amount': 1000,
            'description': 'Test topup'
        }, headers=user_headers)
        assert topup_response.status_code == 200, f"Balance topup failed: {topup_response.json}"

        dish_response = client.post('/api/dishes', json={
            'name': 'Test Dish for Report',
            'weight': 200,
            'ingredients': []
        }, headers=admin_headers)
        assert dish_response.status_code == 200, f"Dish creation failed: {dish_response.json}"
        dish_id = dish_response.json['dish']['id']

        tomorrow = date.today() + timedelta(days=1)
        day_of_week = tomorrow.strftime('%A')

        meal_response = client.post('/api/meals', json={
            'name': 'Test Meal for Report',
            'price': 200,
            'type': 'lunch',
            'dishes': [dish_id],
            'day_of_week': day_of_week
        }, headers=admin_headers)
        assert meal_response.status_code == 200, f"Meal creation failed: {meal_response.json}"
        meal_id = meal_response.json['id']

        order_response = client.post('/api/order', json={
            'meal_id': meal_id,
            'date': tomorrow.isoformat(),
            'payment_type': 'balance'
        }, headers=user_headers)
        assert order_response.status_code == 200, f"Order creation failed: {order_response.json}"

        with patch('fpdf.FPDF.output', return_value=b'%PDF-1.4 test pdf bytes') as mock_output:
            report_response = client.get(
                '/api/report/orders/7',
                headers=admin_headers
            )

            assert report_response.status_code == 200, f"Report generation failed: {report_response.status_code}"
            assert report_response.headers['Content-Type'] == 'application/pdf', \
                f"Wrong content type: {report_response.headers['Content-Type']}"
            assert len(report_response.data) > 0, "PDF file is empty"