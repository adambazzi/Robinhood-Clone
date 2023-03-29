from flask import Blueprint, jsonify, request
from app.models import Transaction, db
from flask_login import login_required
from sqlalchemy import func

transaction_routes = Blueprint('transactions', __name__)

@transaction_routes.route('', methods=['POST'])
@login_required
def create_transaction():
    """
    Create transaction (buy or sell stock)
    """

    # Parse request data
    data = request.get_json()

    # Create new transaction
    new_transaction = Transaction(
        portfolio_id=data.get('portfolioId'),
        stock_id=data.get('stockId'),
        num_shares=data.get('numShares'),
        average_price=data.get('averagePrice'),
        total_expense=data.get('totalExpense'),
    )

    db.session.add(new_transaction)
    db.session.commit()

    # Return newly created transaction
    return jsonify(new_transaction.to_dict()), 201
