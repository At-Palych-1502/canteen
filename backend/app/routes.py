from app import app
from flask import jsonify

@app.route('/api/users')
def users():
    return jsonify([{"id": 1, "name": "Timur"}])