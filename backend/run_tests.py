import pytest
import sys
import os

# Добавляем путь к backend в sys.path, чтобы можно было импортировать модули
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

if __name__ == "__main__":
    # Запускаем pytest с параметрами
    # -v: verbose режим
    # --tb=short: короткий traceback при ошибках
    # tests/: запускаем все тесты в директории tests
    args = [
        '-v',
        '--tb=short',
        'tests/'
    ]
    
    # Запускаем pytest и передаем аргументы
    sys.exit(pytest.main(args))