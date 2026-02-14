from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import PurchaseRequest, Ingredient

from .. import db
from ..utils import role_required

bp = Blueprint('purchase_requests', __name__)

@bp.route('/purchase_requests', methods=['POST', 'GET'])
@jwt_required()
@role_required(['admin', 'cook'])
def purchase_request():
    if request.method == 'GET':
        return {"purchase_requests": [purch_req.to_dict() for purch_req in PurchaseRequest.query.all()]}
    data = request.get_json()
    purchase_req = PurchaseRequest(
        user=get_jwt_identity(),
        ingredient_id=data['ingredient_id'],
        quantity=data['quantity'],
    )
    db.session.add(purchase_req)
    db.session.commit()
    return jsonify({"purchase_req": purchase_req.to_dict()}), 200

@bp.route('/purchase_requests/<int:id>', methods=['PUT', 'GET', 'DELETE'])
@jwt_required()
@role_required(['admin', 'cook'])
def purchase_request_update(id):
    purch_req = PurchaseRequest.query.get_or_404(id)
    if request.method == 'GET':
        return {"purchase_request": purch_req.to_dict()}
    elif request.method == 'PUT':
        data = request.get_json()
        allowed_keys = ['quantity']
        if not all(keys in allowed_keys for keys in data.keys()):
            return jsonify({"error": "Bad request body parameters"}), 400
        for key, value in data.items():
            setattr(purch_req, key, value)
        db.session.commit()
        return jsonify({"purchase_request": purch_req.to_dict()}), 200
    elif request.method == 'DELETE':
        db.session.delete(purch_req)
        db.session.commit()
        return jsonify({"message": "purchase request deleted"}), 200


@bp.route('/purchase_requests/<int:id>/accept', methods=['PUT'])
@jwt_required()
@role_required(['admin'])
def purch_req_accept(id):
    purch_req = PurchaseRequest.query.get_or_404(id)
    if purch_req.is_accepted is True or purch_req.is_accepted is False:
        return jsonify({"error": "actions with this request were already done"}), 400
    purch_req.is_accepted = True
    ingredient = Ingredient.query.get_or_404(purch_req.ingredient_id)
    ingredient.quantity += purch_req.quantity
    db.session.commit()
    return jsonify({"meal": purch_req.to_dict()}), 200


@bp.route('/purchase_requests/<int:id>/reject', methods=['PUT'])
@jwt_required()
@role_required(['admin'])
def purch_req_reject(id):
    purch_req = PurchaseRequest.query.get_or_404(id)
    if purch_req.is_accepted is True or purch_req.is_accepted is False:
        purch_req.is_accepted = False
        db.session.commit()
        return jsonify({"meal": purch_req.to_dict()}), 200
    else:
        return jsonify({"error": ""}), 400