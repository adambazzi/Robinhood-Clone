from flask import Blueprint, jsonify, request
from app.models import Investment, db
from flask_login import login_required, current_user
from sqlalchemy import func

investment_routes = Blueprint('investments', __name__)


@investment_routes.route('/', methods=['POST'])
def create_investment():
    """
    Create stock investment
    """

    # Parse request data
    data = request.get_json()

    # Create new investment
    new_investment = Investment(
        portfolio_id=int(data.get('portfolioId')),
        stock_id=data.get('stockId'),
        num_shares=float(data.get('numShares'))
    )

    db.session.add(new_investment)
    db.session.commit()

    # Return newly created investment
    return jsonify(new_investment.to_dict()), 201


@investment_routes.route('/<int:investmentId>', methods=['PUT'])
def edit_investment(investmentId):
    """
    Edit stock investment
    """

    # Parse request data
    data = request.get_json()
    # Query for the investment to be updated
    investment = Investment.query.get(int(investmentId))

    # Check if the investment exists
    if not investment:
        return jsonify({'message': 'Investment not found'}), 404

    # Update the investment with new data
    investment.num_shares = float(data.get('numShares'))
    investment.stock_id = data.get('stockId')
    investment.portfolio_id = int(data.get('portfolioId'))

    db.session.commit()

    # Return updated investment
    return jsonify(investment.to_dict())

@investment_routes.route('/', methods=['GET'])
def get_investments():
    """
    Get all stock investments for user
    """

    # stock_id = request.args.get('stockId')
    portfolio_id = request.args.get('portfolioId')

    # Query for the investments for the user
    investments = Investment.query.filter_by(
        portfolio_id=int(portfolio_id)
    ).all()

    # Check if any investments exist for the user
    if not investments:
        return jsonify({'message': 'No investments found'}), 404


    # Convert the investments to a list of dictionaries
    investments_dict = [investment.to_dict() for investment in investments]

    # Return the investments
    return jsonify(investments_dict)

@investment_routes.route('/<int:investmentId>', methods=['DELETE'])
def deleteinvestment(investmentId):
    """
    Delete a investment by ID
    """
    # Query for the investment to be deleted
    investment = Investment.query.get(investmentId)

    # Check if the investment exists
    if not investment:
        # Return a 404 error if the investment does not exist
        return jsonify({'message': 'Investment not found'}), 404

    # Delete the investment from the database
    db.session.delete(investment)
    db.session.commit()

    # Return a JSON response with the deleted investment data
    return jsonify(investment.to_dict())
