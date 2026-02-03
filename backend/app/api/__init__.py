from flask import Blueprint
from .auth import bp as auth_bp
from .dish import bp as dish_bp
from .ingredient import bp as ing_bp
from .balance import bp as balance_bp

api = Blueprint('api', __name__, url_prefix='/api')
api.register_blueprint(auth_bp)
api.register_blueprint(dish_bp)
api.register_blueprint(ing_bp)
api.register_blueprint(balance_bp)