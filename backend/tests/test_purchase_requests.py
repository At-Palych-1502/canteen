from app.models import PurchaseRequest, Ingredient, User


def test_purchase_request_creation(client, app):
    with app.app_context():
        # Логинимся как повар
        cook_login = client.post('/api/auth/login', json={
            'username': 'cook',
            'password': 'password',
            "remember_me": True
        })
        assert cook_login.status_code == 200
        cook_token = cook_login.json['access_token']

        # Создаем ингредиент
        ingredient_response = client.post('/api/ingredients', json={
            'name': 'Test Ingredient for Request',
            'quantity': 1
        }, headers={'Authorization': f'Bearer {cook_token}'})
        assert ingredient_response.status_code == 201
        ingredient_id = ingredient_response.json['ingredient']['id']

        # Создаем запрос на закупку
        response = client.post('/api/purchase_requests', json={
            'ingredient_id': ingredient_id,
            'quantity': 5
        }, headers={'Authorization': f'Bearer {cook_token}'})

        assert response.status_code == 200
        assert 'purchase_req' in response.json
        assert response.json['purchase_req']['quantity'] == 5

        # Проверяем, что запрос добавился
        get_response = client.get('/api/purchase_requests', headers={'Authorization': f'Bearer {cook_token}'})
        assert get_response.status_code == 200
        assert len(get_response.json['purchase_requests']) >= 1


def test_purchase_request_update(client, app):
    with app.app_context():
        # Логинимся как повар
        cook_login = client.post('/api/auth/login', json={
            'username': 'cook',
            'password': 'password',
            "remember_me": True
        })
        assert cook_login.status_code == 200
        cook_token = cook_login.json['access_token']

        # Создаем ингредиент
        ingredient_response = client.post('/api/ingredients', json={
            'name': 'Test Ingredient for Update',
            'quantity': 1
        }, headers={'Authorization': f'Bearer {cook_token}'})
        assert ingredient_response.status_code == 201
        ingredient_id = ingredient_response.json['ingredient']['id']

        # Создаем запрос
        req_response = client.post('/api/purchase_requests', json={
            'ingredient_id': ingredient_id,
            'quantity': 5
        }, headers={'Authorization': f'Bearer {cook_token}'})
        assert req_response.status_code == 200
        req_id = req_response.json['purchase_req']['id']

        # Обновляем запрос
        update_response = client.put(f'/api/purchase_requests/{req_id}', json={
            'quantity': 10
        }, headers={'Authorization': f'Bearer {cook_token}'})

        assert update_response.status_code == 200
        assert update_response.json['purchase_request']['quantity'] == 10


def test_purchase_request_accept(client, app):
    with app.app_context():
        # Логинимся как администратор
        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']

        # Логинимся как повар для создания запроса
        cook_login = client.post('/api/auth/login', json={
            'username': 'cook',
            'password': 'password',
            "remember_me": True
        })
        assert cook_login.status_code == 200
        cook_token = cook_login.json['access_token']

        # Создаем ингредиент
        ingredient_response = client.post('/api/ingredients', json={
            'name': 'Test Ingredient for Accept',
            'quantity': 1
        }, headers={'Authorization': f'Bearer {cook_token}'})
        assert ingredient_response.status_code == 201
        ingredient_id = ingredient_response.json['ingredient']['id']

        # Создаем запрос
        req_response = client.post('/api/purchase_requests', json={
            'ingredient_id': ingredient_id,
            'quantity': 5
        }, headers={'Authorization': f'Bearer {cook_token}'})
        assert req_response.status_code == 200
        req_id = req_response.json['purchase_req']['id']

        # Принимаем запрос
        accept_response = client.put(f'/api/purchase_requests/{req_id}/accept', headers={'Authorization': f'Bearer {admin_token}'})

        assert accept_response.status_code == 200
        # Проверяем, что количество ингредиента увеличилось
        ingredient_get = client.get(f'/api/ingredients/{ingredient_id}', headers={'Authorization': f'Bearer {admin_token}'})
        assert ingredient_get.status_code == 200
        assert ingredient_get.json['ingredient']['quantity'] == 6  # 1 + 5
