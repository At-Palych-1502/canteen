from flask import Flask
from .extensions import db, jwt, cors
from .api.__init__ import api
from flask_migrate import Migrate
import os
from .config import Config

def create_app():
    app = Flask(__name__)
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config.from_object(Config)

    migrate = Migrate(app, db)
    db.init_app(app)
    jwt.init_app(app)
    if app.config.get('DEBUG'):
        cors.init_app(app, origins='*')
    else:
        cors.init_app(app)
    app.register_blueprint(api)

    return app

