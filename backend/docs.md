Все запросы выполняются по /api + название группы + название ручки!

**auth**:

_login [POST]_

    формат запроса: {
      "username": username,
      "password": password
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
    