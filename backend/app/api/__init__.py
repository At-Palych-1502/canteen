from flask import Blueprint
from .auth import bp as auth_bp
from .dish import bp as dish_bp
from .ingredient import bp as ing_bp
from .balance import bp as balance_bp
from .meal import bp as meal_bp
from .business import bp as business_bp
from .reviews import bp as review_bp
from .purchase_requests import bp as purchase_bp
from .orders import bp as orders_bp

api = Blueprint('api', __name__, url_prefix='/api')
api.register_blueprint(auth_bp)
api.register_blueprint(dish_bp)
api.register_blueprint(ing_bp)
api.register_blueprint(balance_bp)
api.register_blueprint(meal_bp)
api.register_blueprint(business_bp)
api.register_blueprint(review_bp)
api.register_blueprint(purchase_bp)
api.register_blueprint(orders_bp)