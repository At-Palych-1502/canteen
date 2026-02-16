from app.models import Ingredient

def test_add_ingredient_success(client, app):
    with app.app_context():



        login_response = client.post('/api/auth/login', json={
            'username': 'cook',
            'password': 'password',
            "remember_me": True
        })
        access_token = login_response.json['access_token']

        response = client.post('/api/ingredients', json={
            'name': 'Test Ingredient',
            'quantity': '1'
        }, headers={'Authorization': f'Bearer {access_token}'})

        assert response.status_code == 201
        assert 'ingredient' in response.json


        response_get = client.get('/api/ingredients', headers={'Authorization': f'Bearer {access_token}'})
        assert response_get.status_code == 200
        assert 'data' in response_get.json
        ingredient_names = [ing['name'] for ing in response_get.json['data']]
        assert 'Test Ingredient' in ingredient_names


def test_add_allergic_ingredient_success(client, app):
    with app.app_context():
        student_login = client.post('/api/auth/login', json={
            'username': 'student',
            'password': 'password'
        })
        assert student_login.status_code == 200
        student_token = student_login.json['access_token']

        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password'
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']

        response = client.post('/api/ingredients', json={
            'name': 'Test Allergic Ingredient',
            'quantity': '1'
        }, headers={'Authorization': f'Bearer {admin_token}'})

        assert response.status_code == 201
        assert 'ingredient' in response.json
        ingredient_id = response.json['ingredient']['id']

        response = client.post('/api/add_allergic_ingredient',
                             json={'ingredients_ids': [ingredient_id]},
                             headers={'Authorization': f'Bearer {student_token}', 'Content-Type': 'application/json'})

        assert response.status_code == 200
        assert 'message' in response.json
