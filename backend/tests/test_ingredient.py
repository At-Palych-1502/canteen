from app.models import Ingredient

def test_add_ingredient_success(client, app):
    """Тест успешного добавления нового ингредиента"""
    with app.app_context():


        # Получаем токен
        login_response = client.post('/api/auth/login', json={
            'username': 'cook',
            'password': 'password',
            "remember_me": True
        })
        # assert login_response.status_code == 200
        access_token = login_response.json['access_token']

        # Добавляем ингредиент с авторизацией
        response = client.post('/api/ingredients', json={
            'name': 'Test Ingredient'
        }, headers={'Authorization': f'Bearer {access_token}'})

        assert response.status_code == 200
        assert 'ingredient' in response.json

        # # Проверяем, что ингредиент действительно добавился
        # response_get = client.get('/api/ingredients', headers={'Authorization': f'Bearer {access_token}'})
        # assert response_get.status_code == 200
        # assert 'data' in response_get.json
        # ingredient_names = [ing['name'] for ing in response_get.json['data'].values()]
        # assert 'Test Ingredient' in ingredient_names


def test_add_ingredient_duplicate_name(client, app):
    """Тест добавления ингредиента с дублирующимся названием"""
    with app.app_context():
        # Создаем пользователя и получаем токен
        user_response = client.post('/api/auth/register', json={
            'username': 'cook_test2',
            'email': 'cook2@test.com',
            'password': 'testpassword',
            'name': 'Cook',
            'surname': 'User',
            'patronymic': 'Testovich'
        })
        assert user_response.status_code == 200

        login_response = client.post('/api/auth/login', json={
            'username': 'cook_test2',
            'password': 'testpassword'
        })
        assert login_response.status_code == 200
        access_token = login_response.json['access_token']

        # Первое добавление
        client.post('/api/ingredients', json={
            'name': 'Test Ingredient'
        }, headers={'Authorization': f'Bearer {access_token}'})

        # Попытка добавить с тем же именем
        response = client.post('/api/ingredients', json={
            'name': 'Test Ingredient'
        }, headers={'Authorization': f'Bearer {access_token}'})

        assert response.status_code == 400

        # Проверяем, что только один ингредиент с таким именем
        response_get = client.get('/api/ingredients', headers={'Authorization': f'Bearer {access_token}'})
        assert response_get.status_code == 200
        ingredients_with_name = [ing for ing in response_get.json['data'].values() if ing['name'] == 'Test Ingredient']
        assert len(ingredients_with_name) == 1

def test_add_allergic_ingredient_success(client, app):
    """Тест успешного добавления аллергенного ингредиента"""
    with app.app_context():
        # Создаем пользователя для авторизации
        user_response = client.post('/api/auth/register', json={
            'username': 'student_test',
            'email': 'student@test.com',
            'password': 'testpassword',
            'name': 'Student',
            'surname': 'User',
            'patronymic': 'Testovich'
        })
        assert user_response.status_code == 200

        login_response = client.post('/api/auth/login', json={
            'username': 'student_test',
            'password': 'testpassword'
        })
        assert login_response.status_code == 200
        access_token = login_response.json['access_token']

        # Создаем ингредиент
        admin_user = client.post('/api/auth/register', json={
            'username': 'admin_test',
            'email': 'admin@test.com',
            'password': 'testpassword',
            'name': 'Admin',
            'surname': 'User',
            'patronymic': 'Testovich'
        })
        assert admin_user.status_code == 200

        admin_login = client.post('/api/auth/login', json={
            'username': 'admin_test',
            'password': 'testpassword'
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json['access_token']

        response = client.post('/api/ingredients', json={
            'name': 'Test Allergic Ingredient'
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert response.status_code == 200
        assert 'ingredient' in response.json
        ingredient_id = response.json['ingredient']['id']

        # Добавляем как аллергенный
        response = client.post(f'/api/add_allergic_ingredient/{ingredient_id}',
                             headers={'Authorization': f'Bearer {access_token}'})

        assert response.status_code == 200
        assert 'message' in response.json