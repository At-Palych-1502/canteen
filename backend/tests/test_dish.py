from app.models import Dish, Ingredient, User, DishIngredient

def test_user_becomes_admin_and_adds_dish(client, app):
    with app.app_context():
        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })

        assert 'access_token' in admin_login.json
        admin_token = admin_login.json['access_token']
        admin_user = admin_login.json['user']
        assert admin_user['role'] == 'admin'

        response = client.post('/api/dishes', json={
            'name': 'Admin Test Dish',
            'weight': 250,
            'ingredients': []
        }, headers={'Authorization': f'Bearer {admin_token}'})

        assert response.status_code == 200
        assert 'dish' in response.json
        assert response.json['dish']['name'] == 'Admin Test Dish'

        response_get = client.get('/api/dishes', headers={'Authorization': f'Bearer {admin_token}'})
        assert response_get.status_code == 200
        assert 'data' in response_get.json
        dish_names = [dish['name'] for dish in response_get.json['data']]
        assert 'Admin Test Dish' in dish_names


def test_add_dish_with_empty_ingredients(client, app):
    with app.app_context():
        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']

        response = client.post('/api/dishes', json={
            'name': 'Dish without Ingredients',
            'weight': 300,
            'ingredients': []
        }, headers={'Authorization': f'Bearer {admin_token}'})

        assert response.status_code == 200
        assert 'dish' in response.json
        assert response.json['dish']['name'] == 'Dish without Ingredients'


def test_add_dish_invalid_data(client, app):
    with app.app_context():
        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']

        response = client.post('/api/dishes', json={
            'weight': 250,
            'ingredients': []
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert response.status_code == 400

        response = client.post('/api/dishes', json={
            'name': 'Test Dish',
            'ingredients': []
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert response.status_code == 400

        response = client.post('/api/dishes', json={
            'name': 'Test Dish',
            'weight': -100,
            'ingredients': []
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert response.status_code == 400

        response = client.post('/api/dishes', json={
            'name': 'Test Dish',
            'weight': 250,
            'ingredients': 'not_a_list'
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert response.status_code == 400


def test_regular_user_cannot_add_dish(client, app):
    with app.app_context():
        user_response = client.post('/api/auth/register', json={
            'username': 'regular_user_dish',
            'email': 'regular_dish@example.com',
            'password': 'password',
            'name': 'Regular',
            'surname': 'User',
            'patronymic': 'Testovich'
        })
        assert user_response.status_code == 200

        user_login = client.post('/api/auth/login', json={
            'username': 'regular_user_dish',
            'password': 'password'
        })
        assert user_login.status_code == 200
        user_token = user_login.json['access_token']

        response = client.post('/api/dishes', json={
            'name': 'Unauthorized Dish',
            'weight': 250,
            'ingredients': []
        }, headers={'Authorization': f'Bearer {user_token}'})

        assert response.status_code == 403


def test_get_single_dish(client, app):
    with app.app_context():
        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']

        dish_response = client.post('/api/dishes', json={
            'name': 'Single Dish Test',
            'weight': 200,
            'ingredients': []
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert dish_response.status_code == 200
        dish_id = dish_response.json['dish']['id']

        get_response = client.get(f'/api/dishes/{dish_id}', headers={'Authorization': f'Bearer {admin_token}'})
        assert get_response.status_code == 200
        assert 'data' in get_response.json
        assert get_response.json['data']['name'] == 'Single Dish Test'


def test_get_nonexistent_dish(client, app):
    with app.app_context():
        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']

        get_response = client.get('/api/dishes/99999', headers={'Authorization': f'Bearer {admin_token}'})
        assert get_response.status_code == 404


def test_update_dish(client, app):
    with app.app_context():
        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']

        dish_response = client.post('/api/dishes', json={
            'name': 'Update Test Dish',
            'weight': 200,
            'ingredients': []
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert dish_response.status_code == 200
        dish_id = dish_response.json['dish']['id']

        update_response = client.put(f'/api/dishes/{dish_id}', json={
            'name': 'Updated Dish Name',
            'weight': 350
        }, headers={'Authorization': f'Bearer {admin_token}'})

        assert update_response.status_code == 200
        assert update_response.json['message'] == 'Dish updated'

        get_response = client.get(f'/api/dishes/{dish_id}', headers={'Authorization': f'Bearer {admin_token}'})
        assert get_response.json['data']['name'] == 'Updated Dish Name'
        assert get_response.json['data']['weight'] == 350


def test_update_dish_invalid_field(client, app):
    with app.app_context():
        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']

        dish_response = client.post('/api/dishes', json={
            'name': 'Update Test Dish',
            'weight': 200,
            'ingredients': []
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert dish_response.status_code == 200
        dish_id = dish_response.json['dish']['id']

        update_response = client.put(f'/api/dishes/{dish_id}', json={
            'invalid_field': 'value'
        }, headers={'Authorization': f'Bearer {admin_token}'})

        assert update_response.status_code == 400


def test_delete_dish(client, app):
    with app.app_context():
        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']

        dish_response = client.post('/api/dishes', json={
            'name': 'Delete Test Dish',
            'weight': 200,
            'ingredients': []
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert dish_response.status_code == 200
        dish_id = dish_response.json['dish']['id']

        delete_response = client.delete(f'/api/dishes/{dish_id}', headers={'Authorization': f'Bearer {admin_token}'})
        assert delete_response.status_code == 200
        assert delete_response.json['message'] == 'Dish deleted'

        get_response = client.get(f'/api/dishes/{dish_id}', headers={'Authorization': f'Bearer {admin_token}'})
        assert get_response.status_code == 404


def test_dish_quantity_off(client, app):
    with app.app_context():
        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']

        dish_response = client.post('/api/dishes', json={
            'name': 'Quantity Off Test',
            'weight': 200,
            'ingredients': [],
            'quantity': 10
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert dish_response.status_code == 200
        dish_id = dish_response.json['dish']['id']

        off_response = client.put('/api/dishes/off', json={
            'dish_id': dish_id,
            'quantity': 3
        }, headers={'Authorization': f'Bearer {admin_token}'})

        assert off_response.status_code == 200
        assert off_response.json['message'] == 'success'
        assert off_response.json['dish']['quantity'] == 7


def test_dish_quantity_off_not_enough(client, app):
    with app.app_context():
        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']

        dish_response = client.post('/api/dishes', json={
            'name': 'Quantity Off Not Enough',
            'weight': 200,
            'ingredients': [],
            'quantity': 5
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert dish_response.status_code == 200
        dish_id = dish_response.json['dish']['id']

        off_response = client.put('/api/dishes/off', json={
            'dish_id': dish_id,
            'quantity': 10
        }, headers={'Authorization': f'Bearer {admin_token}'})

        assert off_response.status_code == 400
        assert 'There\'re no enough dishes to off' in off_response.json['error']


def test_dish_quantity_up(client, app):
    with app.app_context():
        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']

        dish_response = client.post('/api/dishes', json={
            'name': 'Quantity Up Test',
            'weight': 200,
            'ingredients': [],
            'quantity': 5
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert dish_response.status_code == 200
        dish_id = dish_response.json['dish']['id']

        up_response = client.put('/api/dishes/up', json={
            'dish_id': dish_id,
            'quantity': 3,
            'off_ingredients': False
        }, headers={'Authorization': f'Bearer {admin_token}'})

        assert up_response.status_code == 200
        assert up_response.json['message'] == 'success'
        assert up_response.json['dish']['quantity'] == 8


def test_regular_user_cannot_modify_dish(client, app):
    with app.app_context():
        user_response = client.post('/api/auth/register', json={
            'username': 'regular_modify_user',
            'email': 'regular_modify@example.com',
            'password': 'password',
            'name': 'Regular',
            'surname': 'User',
            'patronymic': 'Testovich'
        })
        assert user_response.status_code == 200

        user_login = client.post('/api/auth/login', json={
            'username': 'regular_modify_user',
            'password': 'password'
        })
        assert user_login.status_code == 200
        user_token = user_login.json['access_token']

        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']

        dish_response = client.post('/api/dishes', json={
            'name': 'Regular Cannot Modify',
            'weight': 200,
            'ingredients': []
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert dish_response.status_code == 200
        dish_id = dish_response.json['dish']['id']

        update_response = client.put(f'/api/dishes/{dish_id}', json={
            'name': 'Hacked Name'
        }, headers={'Authorization': f'Bearer {user_token}'})
        assert update_response.status_code == 403

        delete_response = client.delete(f'/api/dishes/{dish_id}', headers={'Authorization': f'Bearer {user_token}'})
        assert delete_response.status_code == 403

        off_response = client.put('/api/dishes/off', json={
            'dish_id': dish_id,
            'quantity': 1
        }, headers={'Authorization': f'Bearer {user_token}'})
        assert off_response.status_code == 403