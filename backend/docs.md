Все запросы выполняются по /api + название группы + название ручки!

**auth**:

    login [POST]
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