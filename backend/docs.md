Все запросы выполняются по /api + название ручки!

**auth**:

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

    формат запроса: headers: {
        "Authorization": "Bearer " + jwt_token
        }
    формат ответа:
    [200] {"user": {
        "email": email,
        "id": id,
        "role": role,
        "username": username}}
    [404] {"error": "Not found"}
    [422] any other troubles


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
    Формат запроса: headers: {
        "Authorization": "Bearer " + jwt_token
        "name": String,
        "weight": Integer,
        "meal": String,
        "quantity": Integer
    }
    Формат ответа:
    [200] {"message":"Dish updated"}
    [400] {"error":"Not valid data"}




_dish [POST]_

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


_POST /dish/<int:dish_id>/add_ingredient/<int:ingredient_id> [POST]_

    Требуемая роль: "admin", "cook"
    Формат запроса:{
        "Authorization": "Bearer " + jwt_token
    }
    Формат ответа: 
    [201] {"message":"Ingredient added to dish"}
    [208] {"error":"Ingredient-dish relation already exists"}