# backend/tests/conftest.py
import sys
from pathlib import Path

# Добавляем папку backend в sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

import pytest
from app import create_app
from app.extensions import db

@pytest.fixture
def app():
    """Фикстура тестового приложения"""
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "JWT_SECRET_KEY": "test-secret-key-for-tests-only",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False
    })

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    """Фикстура тестового клиента"""
    return app.test_client()