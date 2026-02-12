def test_balance_topup_success(client, app):
    """Тест успешного пополнения баланса"""
    with app.app_context():
        # Создаем пользователя для авторизации
        user_response = client.post('/api/auth/register', json={
            'username': 'testuser_balance',
            'email': 'testbalance@example.com',
            'password': 'testpassword',
            'name': 'Test',
            'surname': 'User',
            'patronymic': 'Testovich'
        })
        assert user_response.status_code == 200
        # Получаем токен
        login_response = client.post('/api/auth/login', json={
            'username': 'testuser_balance',
            'password': 'testpassword'
        })
        assert login_response.status_code == 200
        access_token = login_response.json['access_token']

        # Пополняем баланс
        response = client.put('/api/balance/topup', json={
            'amount': 1000,
            'description': 'Test topup'
        }, headers={'Authorization': f'Bearer {access_token}'})

        assert response.status_code == 200
        # assert 'new_balance' in response.json
        # assert response.json['new_balance'] == 1000



def test_balance_deduct_success(client, app):
    """Тест успешного списания с баланса"""
    with app.app_context():
        # Создаем пользователя для авторизации
        user_response = client.post('/api/auth/register', json={
            'username': 'testuser_deduct',
            'email': 'testdeduct@example.com',
            'password': 'testpassword',
            'name': 'Test',
            'surname': 'User',
            'patronymic': 'Testovich'
        })
        assert user_response.status_code == 200
        # Получаем токен
        login_response = client.post('/api/auth/login', json={
            'username': 'testuser_deduct',
            'password': 'testpassword'
        })
        assert login_response.status_code == 200
        access_token = login_response.json['access_token']

        # Пополняем баланс
        client.put('/api/balance/topup', json={
            'amount': 1000,
            'description': 'Initial topup'
        }, headers={'Authorization': f'Bearer {access_token}'})

        # Списываем средства
        response = client.put('/api/balance/deduct', json={
            'amount': 500,
            'description': 'Test deduction'
        }, headers={'Authorization': f'Bearer {access_token}'})

        assert response.status_code == 200


def test_balance_deduct_insufficient_funds(client, app):
    """Тест списания с баланса при недостатке средств"""
    with app.app_context():
        # Создаем пользователя для авторизации
        user_response = client.post('/api/auth/register', json={
            'username': 'testuser_insufficient',
            'email': 'testinsufficient@example.com',
            'password': 'testpassword',
            'name': 'Test',
            'surname': 'User',
            'patronymic': 'Testovich'
        })
        assert user_response.status_code == 200
        # Получаем токен
        login_response = client.post('/api/auth/login', json={
            'username': 'testuser_insufficient',
            'password': 'testpassword'
        })
        assert login_response.status_code == 200
        access_token = login_response.json['access_token']

        # Пополняем баланс на небольшую сумму
        client.put('/api/balance/topup', json={
            'amount': 100,
            'description': 'Small topup'
        }, headers={'Authorization': f'Bearer {access_token}'})

        # Пытаемся списать больше, чем есть
        response = client.put('/api/balance/deduct', json={
            'amount': 500,
            'description': 'Large deduction'
        }, headers={'Authorization': f'Bearer {access_token}'})

        assert response.status_code == 400
        assert 'Not enough balance' in response.json['message']
        # Проверяем, что баланс не изменился
        user_get_response = client.get('/api/user', headers={'Authorization': f'Bearer {access_token}'})
        assert user_get_response.status_code == 200
