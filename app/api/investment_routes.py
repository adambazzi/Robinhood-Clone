from flask import Blueprint, jsonify, request
from app.models import Investment, db
from flask_login import login_required, current_user
from sqlalchemy import func

investments_routes = Blueprint('investments', __name__)


@investments_routes.route('/', methods=['POST'])
def create_investment():
    """
    Create stock investment
    """

    # Parse request data
    data = request.get_json()

    # Create new investment
    new_investment = Investment(
        portfolio_id=data.get('portfolioId'),
        stock_id=data.get('stockId'),
        num_shares=data.get('numShares'),
        total_value=data.get('totalValue')
    )

    db.session.add(new_investment)
    db.session.commit()

    # Return newly created investment
    return jsonify(new_investment.to_dict()), 201


@investments_routes.route('/<int:investmentId>', methods=['PUT'])
def edit_investment(investmentId):
    """
    Edit stock investment
    """

    # Parse request data
    data = request.get_json()

    # Query for the investment to be updated
    investment = Investment.query.get(investmentId)

    # Check if the investment exists
    if not investment:
        return jsonify({'message': 'Investment not found'}), 404

    # Update the investment with new data
    investment.num_shares = data.get('numShares')
    investment.average_price = data.get('averagePrice')
    investment.total_value = data.get('totalValue')

    db.session.commit()

    # Return updated investment
    return jsonify(investment.to_dict())

@investments_routes.route('/', methods=['GET'])
def get_investments():
    """
    Get all stock investments for user
    """

    stock_id = request.args.get('stockId')
    portfolio_id = request.args.get('portfolioId')

    # Query for the investments for the user
    investments = Investment.query.filter_by(
        stock_id=stock_id,
        portfolio_id=portfolio_id
    ).all()

    # Check if any investments exist for the user
    if not investments:
        return jsonify({'message': 'No investments found'}), 404

    # Convert the investments to a list of dictionaries
    investments_dict = [investment.to_dict() for investment in investments]

    # Return the investments
    return jsonify(investments_dict)
