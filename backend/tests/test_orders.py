from app.models import Order, Meal, User, Transaction
from datetime import datetime
from unittest.mock import patch, MagicMock

def test_order_create_balance_payment(client, app):
    with app.app_context():
        user_response = client.post('/api/auth/register', json={
            'username': 'testuser_order',
            'email': 'testorder@example.com',
            'password': 'testpassword',
            'name': 'Test',
            'surname': 'User',
            'patronymic': 'Testovich'
        })
        assert user_response.status_code == 200

        login_response = client.post('/api/auth/login', json={
            'username': 'testuser_order',
            'password': 'testpassword'
        })
        assert login_response.status_code == 200
        access_token = login_response.json['access_token']

        client.put('/api/balance/topup', json={
            'amount': 1000,
            'description': 'Test topup'
        }, headers={'Authorization': f'Bearer {access_token}'})

        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']

        dish_response = client.post('/api/dishes', json={
            'name': 'Test Dish for Order',
            'weight': 200,
            'ingredients': []
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert dish_response.status_code == 200
        dish_id = dish_response.json['dish']['id']

        meal_response = client.post('/api/meals', json={
            'name': 'Test Meal for Order',
            'price': 200,
            'type': 'lunch',
            'dishes': [dish_id],
            'day_of_week': 'Monday'
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert meal_response.status_code == 200
        meal_id = meal_response.json['id']

        tomorrow = (datetime.date.today() + datetime.timedelta(days=1)).isoformat()
        order_response = client.post('/api/order', json={
            'meal_id': meal_id,
            'date': tomorrow,
            'payment_type': 'balance'
        }, headers={'Authorization': f'Bearer {access_token}', 'Content-Type': 'application/json'})

        assert order_response.status_code == 200
        assert order_response.json['message'] == 'success'

        user_get = client.get('/api/user', headers={'Authorization': f'Bearer {access_token}'})
        assert user_get.status_code == 200



def test_order_create_subscription_payment(client, app):
    with app.app_context():
        user_response = client.post('/api/auth/register', json={
            'username': 'testuser_sub_order',
            'email': 'testsuborder@example.com',
            'password': 'testpassword',
            'name': 'Test',
            'surname': 'User',
            'patronymic': 'Testovich'
        })
        assert user_response.status_code == 200

        login_response = client.post('/api/auth/login', json={
            'username': 'testuser_sub_order',
            'password': 'testpassword'
        })
        assert login_response.status_code == 200
        access_token = login_response.json['access_token']

        client.put('/api/balance/topup', json={
            'amount': 1000,
            'description': 'Test topup'
        }, headers={'Authorization': f'Bearer {access_token}'})

        sub_response = client.post('/api/subscriptions', json={
            'type': 'lunch',
            'price': 4000
        }, headers={'Authorization': f'Bearer {access_token}'})
        assert sub_response.status_code == 200

        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']

        dish_response = client.post('/api/dishes', json={
            'name': 'Test Dish for Sub Order',
            'weight': 200,
            'ingredients': []
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert dish_response.status_code == 200
        dish_id = dish_response.json['dish']['id']

        meal_response = client.post('/api/meals', json={
            'name': 'Test Meal for Sub Order',
            'price': 200,
            'type': 'lunch',
            'dishes': [dish_id],
            'day_of_week': 'Tuesday'
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert meal_response.status_code == 200
        meal_id = meal_response.json['id']

        tomorrow = (datetime.date.today() + datetime.timedelta(days=1)).isoformat()
        order_response = client.post('/api/order', json={
            'meal_id': meal_id,
            'date': tomorrow,
            'payment_type': 'subscription'
        }, headers={'Authorization': f'Bearer {access_token}', 'Content-Type': 'application/json'})

        assert order_response.status_code == 200
        assert order_response.json['message'] == 'success'

        user_get = client.get('/api/user', headers={'Authorization': f'Bearer {access_token}'})
        assert user_get.status_code == 200

        assert user_get.json['subscription']['duration'] == 19


def test_order_get_list(client, app):
    with app.app_context():

        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']


        response = client.get('/api/orders', headers={'Authorization': f'Bearer {admin_token}'})

        assert response.status_code == 200
        assert 'data' in response.json


def test_order_get_single(client, app):
    with app.app_context():
        user_response = client.post('/api/auth/register', json={
            'username': 'testuser_get_order',
            'email': 'testgetorder@example.com',
            'password': 'testpassword',
            'name': 'Test',
            'surname': 'User',
            'patronymic': 'Testovich'
        })
        assert user_response.status_code == 200

        login_response = client.post('/api/auth/login', json={
            'username': 'testuser_get_order',
            'password': 'testpassword'
        })
        assert login_response.status_code == 200
        access_token = login_response.json['access_token']

        client.put('/api/balance/topup', json={
            'amount': 1000,
            'description': 'Test topup'
        }, headers={'Authorization': f'Bearer {access_token}'})

        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']

        dish_response = client.post('/api/dishes', json={
            'name': 'Test Dish for Get Order',
            'weight': 200,
            'ingredients': []
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert dish_response.status_code == 200
        dish_id = dish_response.json['dish']['id']

        meal_response = client.post('/api/meals', json={
            'name': 'Test Meal for Get Order',
            'price': 200,
            'type': 'lunch',
            'dishes': [dish_id],
            'day_of_week': 'Wednesday'
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert meal_response.status_code == 200
        meal_id = meal_response.json['id']

        tomorrow = (datetime.date.today() + datetime.timedelta(days=1)).isoformat()
        order_response = client.post('/api/order', json={
            'meal_id': meal_id,
            'date': tomorrow,
            'payment_type': 'balance'
        }, headers={'Authorization': f'Bearer {access_token}', 'Content-Type': 'application/json'})
        assert order_response.status_code == 200
        order_id = order_response.json['order_id']


        get_response = client.get(f'/api/orders/{order_id}', headers={'Authorization': f'Bearer {access_token}'})

        assert get_response.status_code == 200
        assert 'order' in get_response.json


def test_order_delete_future(client, app):
    with app.app_context():

        user_response = client.post('/api/auth/register', json={
            'username': 'testuser_delete_order',
            'email': 'testdeleteorder@example.com',
            'password': 'testpassword',
            'name': 'Test',
            'surname': 'User',
            'patronymic': 'Testovich'
        })
        assert user_response.status_code == 200

        login_response = client.post('/api/auth/login', json={
            'username': 'testuser_delete_order',
            'password': 'testpassword'
        })
        assert login_response.status_code == 200
        access_token = login_response.json['access_token']


        client.put('/api/balance/topup', json={
            'amount': 1000,
            'description': 'Test topup'
        }, headers={'Authorization': f'Bearer {access_token}'})

        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']

        dish_response = client.post('/api/dishes', json={
            'name': 'Test Dish for Delete Order',
            'weight': 200,
            'ingredients': []
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert dish_response.status_code == 200
        dish_id = dish_response.json['dish']['id']


        meal_response = client.post('/api/meals', json={
            'name': 'Test Meal for Delete Order',
            'price': 200,
            'type': 'lunch',
            'dishes': [dish_id],
            'day_of_week': 'Thursday'
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert meal_response.status_code == 200
        meal_id = meal_response.json['id']

        tomorrow = (datetime.date.today() + datetime.timedelta(days=1)).isoformat()
        order_response = client.post('/api/order', json={
            'meal_id': meal_id,
            'date': tomorrow,
            'payment_type': 'balance'
        }, headers={'Authorization': f'Bearer {access_token}', 'Content-Type': 'application/json'})
        assert order_response.status_code == 200
        order_id = order_response.json['order_id']

        delete_response = client.delete(f'/api/orders/{order_id}', headers={'Authorization': f'Bearer {access_token}'})

        assert delete_response.status_code == 200
        assert delete_response.json['message'] == 'success'

        user_get = client.get('/api/user', headers={'Authorization': f'Bearer {access_token}'})
        assert user_get.status_code == 200



def test_order_delete_past(client, app):
    with app.app_context():

        user_response = client.post('/api/auth/register', json={
            'username': 'testuser_delete_past',
            'email': 'testdeletepast@example.com',
            'password': 'testpassword',
            'name': 'Test',
            'surname': 'User',
            'patronymic': 'Testovich'
        })
        assert user_response.status_code == 200

        login_response = client.post('/api/auth/login', json={
            'username': 'testuser_delete_past',
            'password': 'testpassword'
        })
        assert login_response.status_code == 200
        access_token = login_response.json['access_token']


        client.put('/api/balance/topup', json={
            'amount': 1000,
            'description': 'Test topup'
        }, headers={'Authorization': f'Bearer {access_token}'})


        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']

        dish_response = client.post('/api/dishes', json={
            'name': 'Test Dish for Delete Past',
            'weight': 200,
            'ingredients': []
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert dish_response.status_code == 200
        dish_id = dish_response.json['dish']['id']

        meal_response = client.post('/api/meals', json={
            'name': 'Test Meal for Delete Past',
            'price': 200,
            'type': 'lunch',
            'dishes': [dish_id],
            'day_of_week': 'Friday'
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert meal_response.status_code == 200
        meal_id = meal_response.json['id']


        today = datetime.date.today().isoformat()
        order_response = client.post('/api/order', json={
            'meal_id': meal_id,
            'date': today,
            'payment_type': 'balance'
        }, headers={'Authorization': f'Bearer {access_token}', 'Content-Type': 'application/json'})
        assert order_response.status_code == 200
        order_id = order_response.json['order_id']


        delete_response = client.delete(f'/api/orders/{order_id}', headers={'Authorization': f'Bearer {access_token}'})

        assert delete_response.status_code == 400
        assert 'Order on today or days before can\'t be deleted' in delete_response.json['error']