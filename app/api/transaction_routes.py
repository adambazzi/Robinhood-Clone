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
        portfolio_id=int(data.get('portfolioId')),
        stock_id=data.get('stockId'),
        num_shares=float(data.get('numShares')),
        average_price=float(data.get('averagePrice')),
        total_expense=float(data.get('totalExpense')),
    )

    db.session.add(new_transaction)
    db.session.commit()

    # Return newly created transaction
    return jsonify(new_transaction.to_dict()), 201

@transaction_routes.route('/')
@login_required
def get_current_user_transactions():
    """
    Get all current user's transactions and returns them in a list of transaction dictionaries
    """
    # Get portfolioId from query parameter
    portfolio_id = int(request.args.get('portfolioId'))

    # Query for all transactions associated with the current user
    current_user_transactions = Transaction.query.filter_by(portfolio_id=portfolio_id).all()

    if not current_user_transactions:
        return jsonify({'message': 'No transactions available'}), 404

    transaction_data = [transaction.to_dict() for transaction in current_user_transactions]

    return jsonify(transaction_data), 200
