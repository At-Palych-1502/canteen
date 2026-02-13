from flask import Flask
from .extensions import db, jwt, cors
from .api.__init__ import api
from flask_migrate import Migrate
import os
from .config import Config

def create_app(test_config=None):
    app = Flask(__name__)
    basedir = os.path.abspath(os.path.dirname(__file__))

    # Загружаем основную конфигурацию (например, из Config)
    app.config.from_object(Config)

    # Если передана тестовая конфигурация — переопределяем
    if test_config is not None:
        app.config.update(test_config)

    # Инициализация расширений
    db.init_app(app)
    jwt.init_app(app)
    migrate = Migrate(app, db)  # Migrate можно инициализировать после db

    # CORS
    if app.config.get('DEBUG'):
        cors.init_app(app, origins='*')
    else:
        cors.init_app(app)

    # Регистрация blueprint'ов
    app.register_blueprint(api)

    return app

