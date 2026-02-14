# backend/tests/conftest.py
import sys
from pathlib import Path
import shutil
import tempfile
import os

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

import pytest
from app import create_app
from app.extensions import db


@pytest.fixture
def app():
    original_db = backend_dir / "db" / "canteen.db"
    if not original_db.exists():
        raise FileNotFoundError(f"База данных не найдена: {original_db}")

    temp_db_fd, temp_db_path = tempfile.mkstemp(suffix=".db")
    shutil.copy(original_db, temp_db_path)

    test_config = {
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": f"sqlite:///{temp_db_path}",
        "JWT_SECRET_KEY": "test-secret-key-for-tests-only",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
    }

    app = create_app(test_config=test_config)

    with app.app_context():
        yield app

        # 🔥 КРИТИЧЕСКИ ВАЖНО: закрыть все соединения
        db.session.remove()
        db.engine.dispose()  # ← это освобождает файл на Windows

        os.close(temp_db_fd)
        try:
            os.unlink(temp_db_path)
        except PermissionError:
            time.sleep(0.1)  # небольшая пауза на случай блокировки
            os.unlink(temp_db_path)


@pytest.fixture
def client(app):
    return app.test_client()