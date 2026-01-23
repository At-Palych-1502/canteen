from flask import Flask
from app.extensions import db, jwt, cors
from app.api.__init__ import api
from flask_migrate import Migrate

def create_app():
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = "your-secret-key"
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///canteen.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    migrate = Migrate(app, db)
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)

    app.register_blueprint(api)

    return app

