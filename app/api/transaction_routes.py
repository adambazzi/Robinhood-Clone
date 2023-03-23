from flask import Blueprint, jsonify, request
from app.models import Transaction, db
from flask_login import login_required
from sqlalchemy import func

transaction_routes = Blueprint('transactions', __name__)

@transaction_routes.route('/<string:ticker>', methods=['POST'])
@login_required
def create_transaction(ticker):
    """
    Create transaction (buy or sell stock)
    """

    # Parse request data
    data = request.get_json()

    # Create new transaction
    new_transaction = Transaction(
        portfolio_id=data.get('portfolio_id'),
        stock_id=ticker.upper(),
        num_shares=data.get('num_shares'),
        average_price=data.get('average_price'),
        total_expense=data.get('total_expense'),
    )

    db.session.add(new_transaction)
    db.session.commit()

    # Return newly created transaction
    return jsonify({'transaction': new_transaction.to_dict()}), 201
