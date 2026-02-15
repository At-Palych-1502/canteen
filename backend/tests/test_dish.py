from app.models import Dish, Ingredient, User

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

        print(admin_login.status_code, admin_user['role'])





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