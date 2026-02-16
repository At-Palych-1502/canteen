from app.models import Review, Dish, User

def test_add_review_success(client, app):
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


        dish_response = client.post('/api/dishes', json={
            'name': 'Test Dish for Review',
            'weight': 200,
            'ingredients': []
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert dish_response.status_code == 200
        assert 'dish' in dish_response.json
        dish_id = dish_response.json['dish']['id']

        user_response = client.post('/api/auth/register', json={
            'username': 'review_user',
            'email': 'review@example.com',
            'password': 'password',
            'name': 'Review',
            'surname': 'User',
            'patronymic': 'Testovich'
        })
        assert user_response.status_code == 200

        user_login = client.post('/api/auth/login', json={
            'username': 'review_user',
            'password': 'password'
        })
        assert user_login.status_code == 200
        assert 'access_token' in user_login.json
        user_token = user_login.json['access_token']

        review_response = client.post('/api/reviews', json={
            'dish_id': dish_id,

            'score': 5,
            'comment': 'Отличное блюдо!'
        }, headers={'Authorization': f'Bearer {user_token}'})

        assert review_response.status_code == 200
        assert 'review' in review_response.json
        assert review_response.json['review']['score'] == 5
        assert review_response.json['review']['comment'] == 'Отличное блюдо!'
        assert review_response.json['review']['username'] == 'review_user'

        reviews_response = client.get(f'/api/dishes/{dish_id}', headers={'Authorization': f'Bearer {admin_token}'})
        assert reviews_response.status_code == 200
        assert 'data' in reviews_response.json
        assert 'reviews' in reviews_response.json['data']
        assert len(reviews_response.json['data']['reviews']) == 1
        assert reviews_response.json['data']['reviews'][0]['comment'] == 'Отличное блюдо!'


def test_add_review_with_invalid_score(client, app):
    """Тест добавления отзыва с некорректной оценкой"""
    with app.app_context():
        admin_login = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'password',
            "remember_me": True
        })
        assert admin_login.status_code == 200
        assert 'access_token' in admin_login.json
        admin_token = admin_login.json['access_token']

        dish_response = client.post('/api/dishes', json={
            'name': 'Test Dish for Invalid Review',
            'weight': 200,
            'ingredients': []
        }, headers={'Authorization': f'Bearer {admin_token}'})
        assert dish_response.status_code == 200
        assert 'dish' in dish_response.json
        dish_id = dish_response.json['dish']['id']

        user_response = client.post('/api/auth/register', json={
            'username': 'review_user_invalid',
            'email': 'review_invalid@example.com',
            'password': 'password',
            'name': 'Review',
            'surname': 'User',
            'patronymic': 'Testovich'
        })
        assert user_response.status_code == 200

        user_login = client.post('/api/auth/login', json={
            'username': 'review_user_invalid',
            'password': 'password'
        })
        assert user_login.status_code == 200
        assert 'access_token' in user_login.json
        user_token = user_login.json['access_token']

        review_response = client.post('/api/reviews', json={
            'dish_id': dish_id,
            'score': 0,
            'comment': 'Плохая оценка'
        }, headers={'Authorization': f'Bearer {user_token}', 'Content-Type': 'application/json'})

        assert review_response.status_code == 405

        review_response = client.post('/api/reviews', json={
            'dish_id': dish_id,
            'score': 6,
            'comment': 'Слишком высокая оценка'
        }, headers={'Authorization': f'Bearer {user_token}', 'Content-Type': 'application/json'})

        assert review_response.status_code == 405
