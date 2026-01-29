import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'sam_dura'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(os.path.dirname(basedir), 'db', 'canteen.db')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'secret_jwt_key'
    DEBUG = os.environ.get('DEBUG') or True