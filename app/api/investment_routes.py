from flask import Blueprint, jsonify, request
from app.models import Investment, db
from flask_login import login_required
from sqlalchemy import func

stock_routes = Blueprint('transactions', __name__)


@stock_routes.route('/<string:ticker', methods=['POST'])
@login_required
def create_investment(ticker):
    """
    Create stock investment
    """

    # Parse request data
    data = request.get_json()

    # Create new investment
    new_investment = Investment(
        portfolio_id=data.get('portfolio_id'),
        stock_id=ticker.upper(),
        num_shares=data.get('shares'),
    )

    db.session.add(new_investment)
    db.session.commit()

    # Return newly created investment
    return jsonify({'investment': new_investment.to_dict()}), 201


@stock_routes.route('/<string:ticker', methods=['PUT'])
@login_required
def edit_investment(ticker):
    """
    Edit stock investment
    """

    # Parse request data
    data = request.get_json()

    # Query for the investment to be updated
    investment = Investment.query.filter_by(
        portfolio_id=data.get('portfolio_id'),
        stock_id=ticker.upper(),
    ).first()

    # Check if the investment exists
    if not investment:
        return jsonify({'message': 'Investment not found'}), 404

    # Update the investment with new data
    investment.num_shares = data.get('shares')
    investment.average_price = data.get('average_price')
    investment.total_expense = data.get('total_expense')
    investment.updated_at = datetime.utcnow()

    db.session.commit()

    # Return updated investment
    return jsonify({'investment': investment.to_dict()})
