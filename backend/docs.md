Все запросы выполняются по /api + название ручки!

**auth**:

_register [POST]_

    формат запроса: {
        "username": String,
        "password": String,
        "email": String,
    }
    форма ответа: 
    [200] {"message": "User added"}
    [400] email or username already exists


_login [POST]_

    формат запроса: {
      "username": String,
      "password": String,
      "remember_me": Boolean
    }
    формат ответа:
    [200] {"access_token": acces_token,
    "user": {
        "email": email,
        "id": id,
        "role": role,
        "username": username}}
    [401] {
    "error": "Invalid credentials"
    }


_user [GET]_
(получение пользователем информации о самом себе)

    формат запроса: headers: {
        "Authorization": "Bearer " + jwt_token}
    формат ответа:
    [200] {"user": {
        "email": email,
        "id": id,
        "role": role,
        "username": username}}
    [404] {"error": "Not found"}
    [422] любые иные ошибки

_user/<int:user_id> [GET]_
(получение информации о пользователе админом или поваром)    

    формат запроса: headers: {
        "Authorization": "Bearer " + jwt_token}
    формат ответа:
    [200] {"user": {
        "email": email,
        "id": id,
        "role": role,
        "username": username}}
    [404] {"error": "Not found"}
    [422] любые иные ошибки

_users [GET]_
(получение информации о всех пользователях админом)

    формат запроса: headers: {
        "Authorization": "Bearer " + jwt_token}
    формат ответа:
    [200] {"data": [{
        "email": email,
        "id": id,
        "role": role,
        "username": username}]}

/change_role/<int:uesr_id> [PUT]
    
    требумые роли: admin
    формат запроса: {"role": choice_of(admin, student, cook'}
    

**dish**:


_/dish/<int:id>  [GET]_

    Требуемая роль: "admin", "cook"
    Формат запроса: headers: {
        "Authorization": "Bearer " + jwt_token
    }
    Формат ответа:
    [404] {"error": "Not found"}
    [200] {"data":{
        "id": id,
        "name": name,
        "weight": weight,
        "quantity": quantity,
        "ingredients": [
            {
                "id":1,
                "name":"свёкла",                
            }]}


_/dish/<int:id>  [DELETE]_
    
    Формат запроса: headers: {
        "Authorization": "Bearer " + jwt_token
    }
    Требуемая роль: "admin", "cook"
    Формат ответа:
    [200] {"message":"Dish deleted"}
    [404] {"error":"Not found"}


_/dish/<int:id>  [PUT]_

    Требуемая роль: "admin", "cook"
    Headers: {
        "Authorization": "Bearer " + jwt_token}
    Формат запроса: {
        "name": String,
        "weight": Integer,
        "meal": String,
        "quantity": Integer
    }
    Формат ответа:
    [200] {"message":"Dish updated"}
    [400] {"error":"Not valid data"}




_/dish [POST]_

    Требуемая роль: "admin", "cook"
    Формат запроса: {
        "name": String,
        "weight": Integer,
        "quantity": Integer
    }
    Формат ответа:
    [201] {"data":{
        "id": id,
        "name": name,
        "weight": weight,
        "quantity": quantity,
        "ingredients": [
            {
                "id":1,
                "name":"свёкла",                
            }]}


/dish/<int:dish_id>/add_ingredient/<int:ingredient_id> [POST]_

    Требуемая роль: "admin", "cook"
    Headers:{
        "Authorization": "Bearer " + jwt_token
    }
    Формат ответа: 
    [201] {"message":"Ingredient added to dish"}
    [208] {"error":"Ingredient-dish relation already exists"}


**ingredients**

_crud логика (/ingredients)_: аналогично для dish, параметры:

    требуемые роли: admin, cook
    Headers: {
        "Authorization": "Bearer " + jwt_token
    }
    Формат запроса: {
        name: String}

/add_allergic_ingredient/<int:ingredient_id> [POST]

    требуемые роли: student
    требуемые роли: admin, cook
    Headers: {
        "Authorization": "Bearer " + jwt_token
    }
    Формат ответа: 
    [200] {'message': 'successfully added allergy'}
    [208] {'error': 'Ingredient-allergy relationship already exists'}


**meals**

/meals [POST]

    требуемые роли: admin
    Headers Bearer
    Тело запроса: {"name": String, "price": Integer,
    "date": "y-m-d", "dishes": [dish_id1, dish_id2, ..0]
    Пример формата даты: "2026-02-08"
    
